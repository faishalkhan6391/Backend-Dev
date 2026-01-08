// =========================
// Task 1: Order Status
// =========================
function checkOrderStatus(orderId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof orderId === 'number') {
                resolve("Order Shipped");
            } else {
                reject("Invalid Order ID");
            }
        }, 1000);
    });
}



async function task1() {
    try {
        const result = await checkOrderStatus(123); // try changing to "abc" to test rejection
        console.log("Task 1:", result);
    } catch (error) {
        console.log("Task 1 Error:", error);
    }
}

// =========================
// Task 2: Multi-Step Authentication
// =========================
function getUser(username) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ name: "Rahul", type: "Premium" });
        }, 1500);
    });
}

function checkSubscription(user) {
    return new Promise((resolve, reject) => {
        if (user.type === "Premium") {
            resolve("Access Granted to Netflix");
        } else {
            reject("Please Subscribe");
        }
    });
}

async function task2() {
    try {
        const user = await getUser("Rahul");
        const subscriptionStatus = await checkSubscription(user);
        console.log("Task 2:", subscriptionStatus);
    } catch (error) {
        console.log("Task 2 Error:", error);
    }
}

// =========================
// Task 3: Smart-Shop Dashboard
// =========================
function fetchUser(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ name: "Rahul", isPremium: true });
        }, 1000);
    });
}

function fetchOrders(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { item: "Laptop", price: 1000, status: "delivered" },
                { item: "Phone", price: 500, status: "pending" }
            ]);
        }, 2000);
    });
}

async function displayDashboard(id) {
    try {
        const user = await fetchUser(id);
        const orders = await fetchOrders(id);

        // Filter delivered orders
        const deliveredOrders = orders.filter(order => order.status === "delivered");

        // Apply discount if premium
        const finalOrders = deliveredOrders.map(order => {
            const discountPrice = user.isPremium ? order.price * 0.9 : order.price;
            return { ...order, price: discountPrice };
        });

        // Calculate total
        const total = finalOrders.reduce((sum, order) => sum + order.price, 0);

        console.log(`Task 3: Welcome ${user.name}!`);
        console.log("Delivered Orders with Discount:", finalOrders);
        console.log("Total:", total);
    } catch (error) {
        console.log("Task 3 Error:", error);
    }
}

// =========================
// Run all tasks
// =========================
async function runAllTasks() {
    await task1();
    await task2();
    await displayDashboard(1);
}

runAllTasks();
