/* jshint ignore:start */
const watch = require('watch');
const path = require('path');
const chalk = require('chalk');
const tsc = require('node-typescript-compiler');

const compileOptions = {
    'target': 'ES6',
    'sourceMap': true
};

const isLintEnabled = true; // TODO could be flag
const failOnLint = false; // TODO could be flag
const tslint = require('tslint');
const fs = require('fs');
const configurationFilename = 'tslint.json';
const lintOptions = {
    fix: false,
    formatter: 'json',
    // rulesDirectory: "customRules/",
    // formattersDirectory: "customFormatters/"
};

function lintTs(path) {
    const fileName = path;
    const fileContents = fs.readFileSync(fileName, 'utf8');
    const linter = new tslint.Linter(lintOptions);
    const configuration = tslint.Configuration.findConfiguration(configurationFilename, fileName).results;
    linter.lint(fileName, fileContents, configuration);
    const result = linter.getResult();
    return result.failures
        .map(mapLintToString);
}

function mapLintToString(result) {
    const lc = result.startPosition.lineAndCharacter;
    const pos = `[${lc.line + 1}, ${lc.character + 1}]`;
    return `Lint ${result.ruleSeverity.toUpperCase()}: ${result.fileName}${pos}: ${result.failure}`;
}

function compileTs(path) {
    // tsc --target ES6 --sourceMap [changedFile]
    tsc.compile(compileOptions, path)
        .then(_ => {
            if(isLintEnabled) {
                const failures = lintTs(path);
                failures.forEach(r => console.log(chalk.yellow.bold(r)));
                if(failOnLint && failures.length > 0) {
                    throw new Error('stopped because failOnLint is on and there were linting errors')
                }
            }
        })
        .then(_ => console.log(chalk.green.bold(`👍${path}`)))
        .catch(err => {
            let message = err;
            if(err.stdout) {
                message = err.stdout;
            }
            console.log(chalk.red(message))
        });
}

watch.createMonitor(__dirname, { interval: 1 }, function (monitor) {
    console.log(chalk.gray.bgGreen.bold('TS-POLY-WATCH started'));

    monitor.on('changed', function (filePath, curr, prev) {
        const ext = path.extname(filePath);
        if(ext === '.ts') {
            console.log(`↻ ${filePath} changed`);
            // TODO Alternatively, see https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
            compileTs(filePath);
        }
    });

    // monitor.on("created", function (f, stat) {
    //     console.log(f + " created");
    // });

    // monitor.on("removed", function (f, stat) {
    //     console.log(f + " removed");
    // });
});
