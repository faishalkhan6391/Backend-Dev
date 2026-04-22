const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cookieParser());

// ================= SESSION CONFIG =================
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 60 * 60 * 1000 // 1 hour
    }
}));

// ================= DATABASE (SIMULATED) =================
const users = [];
const rememberTokens = new Map(); // token -> userId
const resetTokens = new Map(); // email -> {token, expires}

// ================= HELPER FUNCTIONS =================
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Password validation
function validatePassword(password) {
    const errors = [];
    if (password.length < 8) errors.push("Min 8 chars required");
    if (!/[A-Z]/.test(password)) errors.push("Must include uppercase");
    if (!/[a-z]/.test(password)) errors.push("Must include lowercase");
    if (!/\d/.test(password)) errors.push("Must include number");
    if (!/[!@#$%^&*]/.test(password)) errors.push("Must include special char");

    return {
        isValid: errors.length === 0,
        errors
    };
}

// ================= MIDDLEWARE =================
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) return next();
    res.status(401).json({ error: "Login required" });
};

// Remember Me middleware
const checkRememberMe = (req, res, next) => {
    if (req.session.userId) return next();

    const token = req.signedCookies?.rememberMe;
    if (token && rememberTokens.has(token)) {
        const userId = rememberTokens.get(token);
        const user = users.find(u => u.id === userId);

        if (user) {
            req.session.userId = user.id;
            req.session.username = user.username;
        }
    }
    next();
};

app.use(checkRememberMe);

// ================= ROUTES =================

// 🔹 REGISTER
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password)
            return res.status(400).json({ error: "All fields required" });

        const valid = validatePassword(password);
        if (!valid.isValid)
            return res.status(400).json({ error: valid.errors });

        if (users.find(u => u.email === email))
            return res.status(409).json({ error: "User exists" });

        const hash = await bcrypt.hash(password, 10);

        const user = {
            id: users.length + 1,
            username,
            email,
            password: hash
        };

        users.push(user);

        req.session.userId = user.id;

        res.json({ message: "Registered", user: { id: user.id, username, email } });

    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
});

// 🔹 LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        const user = users.find(u => u.email === email);
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        req.session.userId = user.id;
        req.session.username = user.username;

        // Remember Me
        if (rememberMe) {
            const token = generateToken();
            rememberTokens.set(token, user.id);

            res.cookie('rememberMe', token, {
                signed: true,
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
        }

        res.json({ message: "Login success" });

    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

// 🔹 PROFILE (Protected)
app.get('/profile', isAuthenticated, (req, res) => {
    const user = users.find(u => u.id === req.session.userId);

    res.json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});

// 🔹 LOGOUT
app.post('/logout', (req, res) => {
    const token = req.signedCookies.rememberMe;

    if (token) {
        rememberTokens.delete(token);
        res.clearCookie('rememberMe');
    }

    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out" });
    });
});

// 🔹 FORGOT PASSWORD
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    const user = users.find(u => u.email === email);

    if (!user)
        return res.json({ message: "If email exists, reset link sent" });

    const token = generateToken();
    const expires = Date.now() + 3600000;

    resetTokens.set(email, { token, expires });

    console.log(`Reset link:
http://localhost:3000/reset-password?email=${email}&token=${token}`);

    res.json({ message: "Reset link generated (check console)" });
});

// 🔹 RESET PASSWORD
app.post('/reset-password', async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        const data = resetTokens.get(email);

        if (!data || data.token !== token || Date.now() > data.expires)
            return res.status(400).json({ error: "Invalid/expired token" });

        const user = users.find(u => u.email === email);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.password = await bcrypt.hash(newPassword, 10);

        resetTokens.delete(email);

        res.json({ message: "Password reset success" });

    } catch (err) {
        res.status(500).json({ error: "Reset failed" });
    }
});

// 🔹 AUTH STATUS
app.get('/auth/status', (req, res) => {
    if (!req.session.userId)
        return res.json({ authenticated: false });

    const user = users.find(u => u.id === req.session.userId);

    res.json({
        authenticated: true,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});

// ================= SERVER =================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});