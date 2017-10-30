const watch = require('watch');
const path = require('path');
const chalk = require('chalk');
const tsc = require('node-typescript-compiler');

const options = {
    'target': 'ES6',
    'sourceMap': true
};

function compileTs(path) {
    // tsc --target ES6 --sourceMap [changedFile]
    tsc.compile(options, path)
        .then(_ => console.log(chalk.green.bold(`👍${path}`)))
        .catch(err => console.log(chalk.red(err.stdout)));
}

watch.createMonitor(__dirname, { interval: 1 }, function (monitor) {
    console.log(chalk.gray.bgGreen.bold('TS-POLY-WATCH started'));

    monitor.on('changed', function (filePath, curr, prev) {
        const ext = path.extname(filePath);
        if(ext === '.ts') {
            console.log(`↻ ${filePath} changed`);
            // TODO Alternatively, see https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
            compileTs(filePath)
        }
    });

    // monitor.on("created", function (f, stat) {
    //     console.log(f + " created");
    // });

    // monitor.on("removed", function (f, stat) {
    //     console.log(f + " removed");
    // });
});
