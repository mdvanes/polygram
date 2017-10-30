const watch = require('watch');
const path = require('path');
const chalk = require('chalk');
//const { execFile } = require('child_process');
const tsc = require('node-typescript-compiler');

// return tsc.compile({
//     'help': true
// })

watch.createMonitor(__dirname, { interval: 1 }, function (monitor) {
    console.log(chalk.gray.bgGreen.bold('TS-POLY-WATCH started'));
    // monitor.on("created", function (f, stat) {
    //     console.log(f + " created");
    // });

    //const x = '/home/martin/ZNoBackup/polygram/polygram-marvel-details.ts';
    // execFile('./node_modules/.bin/tsc', ['--target ES6', '--sourceMap', x], (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(chalk.red(stderr, error));
    //         throw error;
    //     }
    //     console.log(stdout);
    // });

    // tsc.compile(
    //     {
    //         'target': 'ES6',
    //         'sourceMap': true
    //     },
    //     x
    // );


    monitor.on('changed', function (f, curr, prev) {
        const ext = path.extname(f);
        if(ext === '.ts') {
            console.log(f + ' changed');
            // TODO https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
            // tsc --target ES6 --sourceMap [changedFile]
            // execFile('./node_modules/.bin/tsc', ['--target ES6', '--sourceMap', f], (error, stdout, stderr) => {
            //     if (error) {
            //         console.log(chalk.red(stderr, error));
            //         throw error;
            //     }
            //     console.log(stdout);
            // });
            tsc.compile(
                {
                    'target': 'ES6',
                    'sourceMap': true
                },
                f
            );
        }
    });
    // monitor.on("removed", function (f, stat) {
    //     console.log(f + " removed");
    // });
});
