const fs = require("fs");
const path = require("path");
const readline = require("readline");

const command = process.argv[2];

// ===============================
// LAB 1: FILE MANAGER
// ===============================
function fileManager() {
    const action = process.argv[2];
    const file = process.argv[3];
    const data = process.argv[4];

    try {
        switch (action) {
            case "read":
                console.log(fs.readFileSync(file, "utf-8"));
                break;

            case "write":
                fs.writeFileSync(file, data);
                console.log("File written successfully");
                break;

            case "copy":
                fs.copyFileSync(file, data);
                console.log("File copied successfully");
                break;

            case "delete":
                fs.unlinkSync(file);
                console.log("File deleted successfully");
                break;

            case "list":
                const files = fs.readdirSync(file);
                files.forEach(f => console.log(f));
                break;
        }
    } catch (err) {
        console.log("Error:", err.message);
    }
}

// ===============================
// LAB 2: LOG FILE ANALYZER
// ===============================
function analyzeLog() {
    const logFile = process.argv[3];

    let total = 0;
    let errors = 0;
    let warnings = 0;

    const rl = readline.createInterface({
        input: fs.createReadStream(logFile),
        crlfDelay: Infinity
    });

    rl.on("line", (line) => {
        total++;
        if (line.includes("ERROR")) errors++;
        if (line.includes("WARN")) warnings++;
    });

    rl.on("close", () => {
        console.log("Log Summary");
        console.log("Total Lines:", total);
        console.log("Errors:", errors);
        console.log("Warnings:", warnings);
    });
}

// ===============================
// LAB 3: FILE SYNCHRONIZATION
// ===============================
function syncDirectories() {
    const source = process.argv[3];
    const target = process.argv[4];

    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }

    const sourceFiles = fs.readdirSync(source);

    sourceFiles.forEach(file => {
        const srcPath = path.join(source, file);
        const destPath = path.join(target, file);

        if (!fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${file}`);
        }
    });

    console.log("Synchronization complete");
}

// ===============================
// COMMAND ROUTER
// ===============================
if (["read", "write", "copy", "delete", "list"].includes(command)) {
    fileManager();
} else if (command === "analyze") {
    analyzeLog();
} else if (command === "sync") {
    syncDirectories();
} else {
    console.log("Invalid command");
}
