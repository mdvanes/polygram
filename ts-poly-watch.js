const watch = require('watch');
const path = require('path');
const chalk = require('chalk');
const tsc = require('node-typescript-compiler');

const compileOptions = {
    'target': 'ES6',
    'sourceMap': true
};


const tslint = require('tslint');
const fs = require('fs');
const fileName = 'polygram-marvel-details.ts';
const configurationFilename = 'tslint.json';
const lintOptions = {
    fix: false,
    formatter: 'json',
    // rulesDirectory: "customRules/",
    // formattersDirectory: "customFormatters/"
};
const fileContents = fs.readFileSync(fileName, 'utf8');
const linter = new tslint.Linter(lintOptions);
const configuration = tslint.Configuration.findConfiguration(configurationFilename, fileName).results;
linter.lint(fileName, fileContents, configuration);
const result = linter.getResult();
console.log('tslint result', result);

function mapLintToString(result) {
    const lc = result.startPosition.lineAndCharacter;
    const pos = `[${lc.line + 1}, ${lc.character + 1}]`;
    return `${result.ruleSeverity.toUpperCase()}: ${result.fileName}${pos}: ${result.failure}`;
}

const result2 = result.failures
    //.map(r => r.ruleSeverity.toUpperCase() + ': ' + r.fileName + '[' + r.startPosition + ': ' + r.failure)
    //.map(r => r.startPosition.lineAndCharacter.line + ' ' + r.startPosition.lineAndCharacter.character )
    .map(mapLintToString)
    .forEach(r => console.log(r));


function compileTs(path) {
    // tsc --target ES6 --sourceMap [changedFile]
    tsc.compile(compileOptions, path)
        .then(_ => console.log(chalk.yellow.bold(`linting NYI ${path}`))) // TODO
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
