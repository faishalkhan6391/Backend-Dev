/*****************************************************
 * Node.js Assignment – All Exercises in One File
 * Author: Engineering Student
 *****************************************************/

const fs = require('fs');
const os = require('os');
const http = require('http');

/* =====================================================
   Exercise 1: File Operations
   Read a text file, count words, write count to new file
===================================================== */

function countWordsInFile(inputFile, outputFile) {
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err.message);
            return;
        }
        const wordCount = data.trim().split(/\s+/).length;
        fs.writeFile(outputFile, `Word Count: ${wordCount}`, (err) => {
            if (err) {
                console.error('Error writing file:', err.message);
                return;
            }
            console.log('Exercise 1: Word count written successfully');
        });
    });
}

// Example usage
countWordsInFile('input.txt', 'wordcount.txt');


/* =====================================================
   Exercise 2: Custom Module (stringUtils)
===================================================== */

const stringUtils = {
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    reverse(str) {
        return str.split('').reverse().join('');
    },
    countVowels(str) {
        return (str.match(/[aeiou]/gi) || []).length;
    }
};

// Example usage
console.log('\nExercise 2:');
console.log(stringUtils.capitalize('nodejs'));
console.log(stringUtils.reverse('engineering'));
console.log('Vowels:', stringUtils.countVowels('engineering'));


/* =====================================================
   Exercise 3: System Information Logger
   Logs system info every 5 seconds to a file
===================================================== */

function logSystemInfo() {
    const info = `
Time: ${new Date().toISOString()}
Platform: ${os.platform()}
CPU Cores: ${os.cpus().length}
Total Memory: ${(os.totalmem() / 1024 ** 3).toFixed(2)} GB
Free Memory: ${(os.freemem() / 1024 ** 3).toFixed(2)} GB
-----------------------------------------
`;
    fs.appendFile('system-log.txt', info, (err) => {
        if (err) console.error('Logging error:', err.message);
    });
}

// Log every 5 seconds
setInterval(logSystemInfo, 5000);


/* =====================================================
   Exercise 4: Simple TODO API (In-memory)
===================================================== */

let todos = [];
let todoId = 1;

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json');

    // GET all todos
    if (url === '/todos' && method === 'GET') {
        res.end(JSON.stringify(todos));
    }

    // POST new todo
    else if (url === '/todos' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const todo = JSON.parse(body);
            todo.id = todoId++;
            todos.push(todo);
            res.end(JSON.stringify(todo));
        });
    }

    // PUT update todo
    else if (url.startsWith('/todos/') && method === 'PUT') {
        const id = parseInt(url.split('/')[2]);
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const updated = JSON.parse(body);
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.task = updated.task;
                res.end(JSON.stringify(todo));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Todo not found' }));
            }
        });
    }

    // DELETE todo
    else if (url.startsWith('/todos/') && method === 'DELETE') {
        const id = parseInt(url.split('/')[2]);
        todos = todos.filter(t => t.id !== id);
        res.end(JSON.stringify({ message: 'Todo deleted' }));
    }

    // Invalid route
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(3000, () => {
    console.log('\nExercise 4: TODO API running at http://localhost:3000');
});


/* =====================================================
   Exercise 5: Event Loop Execution Order
===================================================== */

console.log('\nExercise 5: Event Loop Demo');

console.log('Start');

setTimeout(() => {
    console.log('setTimeout');
}, 0);

setImmediate(() => {
    console.log('setImmediate');
});

Promise.resolve().then(() => {
    console.log('Promise');
});

process.nextTick(() => {
    console.log('nextTick');
});

console.log('End');

/*
Expected Output Order:
Start
End
nextTick
Promise
setTimeout
setImmediate
*/
