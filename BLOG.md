# Polymer 2 and TypeScript

For [reasons beyond my control](http://mdworld.nl/blog/webdevelopment/2017/07/30/polymer2-redux/) I'm working with
Polymer 2 at the moment. Although the idea of web components is great, the choice for HTML imports that comes with
Polymer 2 makes integration into a modern development stack cumbersome, as will become clear soon.

**polyfills for html imports are available, but these are pretty intransparent**

Using TypeScript seems like a good choice, because strong typing helps prevent runtime errors. Additionally it would a
good opportunity to try out the [Scala-TS-interfaces project](https://github.com/code-star/scala-ts-interfaces) by my
colleagues, that can generate TypeScript from a Scala domain model. Unfortunately, adding TypeScript to a Polymer 2
development stack proves to be cumbersome, whereas using it with Polymer 3 seems trivial. Polymer 3 is currently in
preview so it is not a viable option for me for the moment, but it will exchange HTML imports for ES6 Modules. This will
make integrating it into a modern development stack much easier. An [example](https://github.com/mdvanes/polymer3-typescript)
already exists, by [Paolo Ferretti](https://github.com/pferretti) and follows normal conventions for a TypeScript project.

If you're adventurous, don't need any [existing Polymer 2 elements](https://www.webcomponents.org/) and don't need to
run production stop reading here and use Polymer 3. If you need Polymer 2 read on, but be warned that it won't be pretty.

The first challenge is to use webpack with Polymer 2. Although not strictly necessary for TypeScript compilation, it would
make sense for importing HTML as modules. Fortunately, [Rob Doddson himself](https://www.youtube.com/playlist?list=PLOU2XLYxmsII5c3Mgw6fNYCzaWrsM3sMN) wrote an
article [How to use Polymer with Webpack](http://robdodson.me/how-to-use-polymer-with-webpack/). It even mentions TypeScript!
The article introduces the webpack loader [https://github.com/webpack-contrib/polymer-webpack-loader](https://github.com/webpack-contrib/polymer-webpack-loader) and
explains how it extracts the JavaScript from the HTMl of Polymer elements and eventually combines everything into one
JavaScript file. I was basically able to copy the webpack.config.js and index.ejs and that would compile. I moved my
[custom elements](https://github.com/mdvanes/polygram/tree/webpack) from the root of the project to the src dir and I had
to modify the paths to the bower_components and it would basically work. 

The most important exception is Redux, the redux-mixin.html can't resolve the PolymerRedux.html dependency. The polymer-webpack-loader
should resolve this, but runtime it logs `Uncaught ReferenceError: PolymerRedux is not defined`. The loader seems to
import the HTML element that goes into the `template` element, but not the JavaScript variables that go into the `script` element.
The PolymerRedux code is distributed as JavaScript wrapped in a `script` tag in mainly one file, so it would be easy to
extract it into a JavaScript file. Or even to import `polymer-redux/src/index.js` instead of `polymer-redux/polymer-redux.html` 
(this does not work because it is uncompiled and misses external dependencies that are not installed in bower_components). For now, I just 
comment out the Redux dependencies.





The article uses Babel and import from npm modules. Was easy to migrate, but loses polyserve / the 
poly serve/demo pages / polylint still possible? wct still possible? Lazy loading PRPL? @

# Adding ts-loader

Normally, to migrate from JavaScript to TypeScript with Webpack, it would be enough to add the [ts-loader] to the Webpack
config and to rename the JavaScript files to TypeScript files. 

So I started with changing the extension for the bootstrapping index.js and adding .ts as a resolved extension:

```javascript
// webpack.config.js
...
entry: path.resolve(__dirname, 'src/index.ts'),
...
resolve: {
        extensions: ['.ts', '.js'],
...
```

And adding this loader:

```javascript
// webpack.config.js
{
    test: /\.ts?$/,
    use: [
        { loader: 'babel-loader' },
        { loader: 'ts-loader' }
    ]
}
```

And creating a tsconfig.json:
```javascript
{
  "compilerOptions": {
    "sourceMap": true,
  }
}
```

Everything still compiles, but the JavaScript is embedded in the HTML and is ignored by the ts-loader.

Adding the ts-loader to the chain breaks the compilation:

```javascript
// webpack.config.js
{
    test: /\.html$/,
    use: [
        { loader: 'babel-loader' },
        { loader: 'ts-loader' }, // <--
        { loader: 'polymer-webpack-loader' }
    ]
},
```


Even without changing any of the code itself, compilation fails with:

`
ERROR in ./src/polygram-app.html
Module build failed: Error: Could not find file: '/home/me/polygram/src/polygram-app.html'.
`

Well, that just doesn't look healthy. I filed [a bug](https://github.com/webpack-contrib/polymer-webpack-loader/issues/64) 
and will look into the code of the polymer-webpack-loader later to see if this can be solved, but for the moment I will
try to work around it by extracting the TypeScript code to a separate file.


## Workaround for ts compilation in a Polymer element

After removing the `ts-loader` line from the html rule in the webpack.config.js I set out to extract TypeScript to a
separate file so it can be compiled with the rule that matches ts files. 

Rougly, the main entry point for the Polymer elements `polygram-app.html` contains:

```html
// imports
<link rel="import" href="../bower_components/polymer/polymer-element.html">
...
<link rel="import" href="polygram-details.html">
<link rel="import" href="polygram-searchbox.html">

<dom-module id="polygram-app">
    <template>
        <!-- Style -->
        <style include="iron-flex iron-flex-alignment"></style>

        <!-- Markup -->
        <div class="layout vertical">
            ...
        </div>
        ...
    </template>
    <script>
        // Script
        import format from 'date-fns/format';

        class PolygramApp extends Polymer.Element {
            static get is() { return 'polygram-app'; }
            static get properties() {
                return {
                    today: {
                        type: String,
                        value: function() {
                            return format(new Date(), 'MM/DD/YYYY');
                        }
                    }
                }
            }
        }
        window.customElements.define(PolygramApp.is, PolygramApp);
    </script>
</dom-module>
```

Since I know the `import` statement in the script tag works, I can use this to my advantage. Lets create a companion
TypeScript file for polygram-app.html named PolygramApp.ts.

```typescript
// PolygramApp.ts
import format from 'date-fns/format';

export default class PolygramApp extends Polymer.Element {
    static get is() { return 'polygram-app'; }
    static get properties() {
        return {
            today: {
                type: String,
                value: function() {
                    return format(new Date(), 'MM/DD/YYYY');
                }
            }
        }
    }
}
``` 

and to import this in the HTML:

```html
<!-- polygram-app.html -->
...

<dom-module id="polygram-app">
    ...
    <script>
        // Script
        import PolygramApp from './polygramApp';
        window.customElements.define(PolygramApp.is, PolygramApp);
    </script>
</dom-module>
```

Compilation fails with 4 errors.

*now to add some typings*
*script tag*

Workaround :
So extracting ts to separate file, so webpack match for tsloader can be... instead of part of the html match...  .
How to load? Now using import (code example)  but would script tag work?

## Failing accessors

The `is` and `properties` getters require a specifically set target ECMAScript version, the compilation error is:
`error TS1056: Accessors are only available when targeting ECMAScript 5 and higher`. It surprises me that the default
ES target is ES3, but it's no problem to use ESNext here, because the babel-loader will transpile it back to ES5.

In the tsconfig.json added `"target": "ESNext"` to compilerOptions, that fixes this error.

## Failing Polymer import

`Polymer` can't be found for the `extends`. This is the most difficult of these errors to solve, because it is caused by the preferred module 
architecture of Polymer 2: because HTML imports are used, it is not possible to use `import Polymer from '../bower_components/polymer/polymer-element.html'`
because this polymer-element does not export `Polymer` as an ES6 module. The webpack-polymer-loader can resolve HTML
imports, but using `import '../bower_components/polymer/polymer-element.html'` results in an `error TS2304: Cannot find name 'Polymer'`
I assume because it results in an HTML import @@@
 
For the moment, I'm just removing the `extends Polymer.Element` from PolygrayApps.ts and `window.customElements.define(PolygramApp.is, PolygramApp);` from polygram-app.html.
@@@ try with html import/require/ts ref imports


## Failing date-fns import

To be able to continue resolving the compilation errors, I add a log statement to polygram-app.html:

```html
<!-- polygram-app.html -->
...

<dom-module id="polygram-app">
    ...
    <script>
        // Script
        import PolygramApp from './polygramApp';
        console.log(PolygramApp.properties.today.value());
    </script>
</dom-module>
```

The import of date-fns originally failed in the TypeScript compilation with 
`error TS1192: Module ''date-fns/format'' has no default export.` but at this point that has two different behaviors:

* The IDE warns `TS2307 Cannot find module date-fns`
* Compilation succeeds, but this error is logged in the browser: `Uncaught TypeError: format_1.default is not a function(…)`

I first thought that this was caused by missing typings for the date-fns library, so I tried
`npm install @types/date-fns` but this logs that date-fns actually provides typings.

Eventually I was able to fix the Uncaught TypeError by changing the import in PolygramApp.ts from

```javascript
import format from 'date-fns/format';
```

to

```javascript
import { format } from 'date-fns';
```

And the IDE warning by adding `"moduleResolution": "node"` to the compilerOptions in tsconfig.json.

At this point, nothing is rendered, but because of the added log statement, the current date is logged in the browser console. 


## Failing Polymer import, continued

Now the import succeeds and it is clear that the TypeScript compiler correctly processes PolygramApp.ts, it is time to 
try to fix the import of the `Polymer` module in PolygramApp.ts.

A possible workaround will be to not try to import HTML imports in the TypeScript file, but instead to supply those dependencies
through the HTML that is importing the TypeScript file. To do this, I change:

```html
<!-- polygram-app.html -->
...

<dom-module id="polygram-app">
    ...
    <script>
        // Script
        import PolygramAppFactory from './PolygramApp';
        const PolygramApp = PolygramAppFactory.create(Polymer);
        window.customElements.define(PolygramApp.is, PolygramApp);
    </script>
</dom-module>
```

```typescript
// PolygramApp.ts
import { format } from 'date-fns';
const label: string = 'Current Date: ';

function create(Polymer) {
    return class PolygramApp extends Polymer.Element {
        static get is() { return 'polygram-app'; }
        static get properties() {
            return {
                today: {
                    type: String,
                    value: function() {
                        return label + format(new Date(), 'YYYY-MM-DD');
                    }
                }
            }
        }
    }
}

export default { create }
``` 

Now everything compiles without errors and the custom elements are rendered again!
 
@@@ But it would be better to see why polymer-webpack-loader is not importing Polymer when using `import Polymer from '../bower_components/polymer/polymer-element.html'`
or `import '../bower_components/polymer/polymer-element.html'`.


## Re-enabling Redux

Earlier, Redux was disabled to test Webpack. To re-enable it, I convert the `polymer-redux/polymer-redux.html` from 
bower_components to a local PolymerRedux.js, by just removing the `script` tags.

Because redux-mixin.html, action.html, and reducer.html actually are already JavaScript wrapped in `script` tags, I just convert
them to TypeScript files.

```typescript
// ReduxMixin.ts
import {createStore, combineReducers, compose} from 'redux';
const PolymerRedux = require('exports-loader?PolymerRedux!./PolymerRedux');
...
export const ReduxMixin = PolymerRedux(reduxStore);
```

To use it in PolygramApp.ts, it can now be imported normally:

```typescript
// PolygramApp.ts
import { format } from 'date-fns';
const label: string = 'Current Date: ';
import {ReduxMixin, reduxStore} from './ReduxMixin';

function create(Polymer) {
    return class PolygramApp extends ReduxMixin(Polymer.Element) {
        static get is() { return 'polygram-app'; }

        static get properties() {
            // Added Redux code here
            ...
        }

        ready() {
            // Added Redux code here
            ...
        }

    }
}

export default { create }
```

After making similar modifications for polygram-searchbox, the Redux events work again as before introducing TypeScript. 

# Importing a global variable from HTML

Now PolymerRedux is loaded from a custom PolymerRedux.js that I made by removing the `<script>` tags from the file in bower_components,
and although this works, it would be better to use the file in bower_components directly because it will be easier to handle
upgrades.

Currently I import the custom PolymerRedux.js in state/ReduxMixin.ts with:

```typescript
const PolymerRedux = require('exports-loader?PolymerRedux!./PolymerRedux');
```
 
To load the HTML from the bower_components, I expect to have to use the polymer-webpack-loader to extract the JavaScript
from the `script` tags:

```typescript
const PolymerRedux = require('exports-loader?PolymerRedux!polymer-webpack-loader!../../bower_components/polymer-redux/dist/polymer-redux.html');
``` 

This fails to compile with the message that PolymerRedux is undefined, so I add the [debug-loader](https://github.com/ianwalter/debug-loader) to
investigate what the result of each step looks like:

```typescript
const PolymerRedux = require('exports-loader?PolymerRedux!polymer-webpack-loader!debug-loader?id=raw!../../bower_components/polymer-redux/dist/polymer-redux.html');
``` 

Thanks to debug-loader it is immediately clear that already before going into the polymer-webpack-loader the `script` tags have
been stripped. Just using require without any loaders turns something likes this `<script>foo()</script>` into `foo()`
and webpack-polymer-loader is not needed in this case. I do think this only works when the file is completely self 
contained and does not have dependencies with other Polymer HTML files.

This is the final working import:

```typescript
// tslint:disable-next-line
const PolymerRedux = require('exports-loader?PolymerRedux!../../bower_components/polymer-redux/dist/polymer-redux.html');
``` 

# Linting

Although there is a [polymer-linter](https://github.com/Polymer/polymer-linter), it is [advised](https://github.com/Polymer/polymer-linter#use-with-other-tools) to 
use Polymer Linter combined with other linters, and a obvious choice is TSLint.

The way that TSLint is configured with Webpack, means that it will only lint TypeScript that is not embedded in HTML:

```javascript
// webpack.config.js
new TSLintPlugin({
            files: ['./src/**/*.ts'] // TODO so, this requires all the .ts not to be inline in HTML?
        })
```

Before I started with this experiment, I thought this might be a problem, but now almost all script has been extracted to
separate TypeScript files anyway, so this works quite well. 

It is still required to run `polymer lint` manually. As far as I know there is no integration for Webpack yet.

# App vs Element
One thing to do Typescript for polymer app, other thing for reusable polymer component.
The current solution will generate a compiled app, but does not allow importing (check?) and how about lazy loading?
Current compilation is one huge blob.

Next attempt will be to make a standard demo page for one of the elements: these demo pages have a standard layout and just
load in one stand-alone Polymer Element.
@@@ Build or livereload the demo?
Must be with webpack build and not webpack dev server. A good way to test would be to import it into the demo page and serve
the demo page with `polymer serve`
If I just run `./node_modules/.bin/webpack --config webpack.config.js` with the current project, it will build a 
dist dir containing amongst others an index.html and a bundle.js. This is a standalone app, but this would not be a good workflow to 
distribute a polymer component because:
* the index.html is a complete HTML document, not just a `dom-module`
* the bundle.js contains not only the compiled code for the component, but also TypeScript, Webpack and Polymer polyfills and libraries (like lodash in this case)
that you would want to load once and not for every component. The bundle.js is already 2.8MB in size (unminified) / 347KB (minified).

Would it be possible to make a Polymer component that uses the `<script src="foo.js">` style import and then do a "naive"
compilation from foo.ts to foo.js? Would this be possible with tsc or also via Webpack?
Would this work with ES6 imports? Seems to work in the wc-loader project.
Try this out as small as possible:
* using /polygram-details.html (the old, non-TS version) and demo/polygram-details (already using version /polygram-details)
* do not run webpack, but `polymer serve` and test demo page -> works (of course)
* replace `<script>... code ...</script>` by `<script src="polygram-details.js"></script>`, extract js to polygram-details.js and test demo page -> works

Now to TS

* rename `polygram-detail.js` and the reference to it in `polygram-details.html` to `polygram-details.ts` 
* because the package typescript was installed before, I can use `tsc`: `./node_modules/.bin/tsc polygram-details.ts` ->
    this gives errors, but does generate code. The resulting code does not run.
    The errors:
polygram-details.ts(8,31): error TS2304: Cannot find name 'Polymer'.
polygram-details.ts(33,14): error TS2339: Property '_searchResult' does not exist on type 'PolygramDetails'.
polygram-details.ts(35,18): error TS2339: Property '_searchIAUrl' does not exist on type 'PolygramDetails'.
polygram-details.ts(42,18): error TS2339: Property '_searchResult' does not exist on type 'PolygramDetails'.
-> adding `declare const Polymer: any;` fixes these 4 errors. It tells TypeScript a global variable `Polymer` can be expected.  

polygram-details.ts(9,16): error TS1056: Accessors are only available when targeting ECMAScript 5 and higher.
polygram-details.ts(13,16): error TS1056: Accessors are only available when targeting ECMAScript 5 and higher.
-> it seems to ignore the tsconfig.json, because this was solved earlier by adding `"target": "ESNext"` in the config.
Specifying on the command line: `./node_modules/.bin/tsc --target ES6 polygram-details.ts`
This runs without errors and works in the browser!

This much simpler approach without Webpack seems to provide a more realistic workflow. Can we skip Webpack? Let's reiterate its use:

**Webpack transpiles to ES5 with Babel.** 

As mentioned before we don't need Babel for transpilation, the TypeScript compiler can be set to ES6 or ES5. 

**Webpack provides a development server with hot module reloading**

Hot Module Replacement is mainly to ease development, but we can use livereload combined with polyserve instead which would be acceptable for this use case.  

**Webpack handles module bundling**

We can do without ES6 modules or packaging other resources like images as JavaScript modules, because we already have to
deal with Polymer Elements as a component system. We have to distribute the end result as Polymer Elements to be able to add it to the catalog.
Although Polymer 3 will use ES6 modules, a tool is supposed to become available that should handle this conversion.
Without Webpack we lose the module polyfill that is injected per file, which potentially saves an enormous amount of overhead
while staying closer to the concept of Polymer Element development.
External JavaScript files can not be resolved with `import`, but instead the placeholder `declare` can be used. We would
lose the possibility to import from `node_modules`.
Packaging CSS as a module can be used as a way of scoping CSS, but this is actually something that is already solved very well
in Polymer with Shadow DOM.  


## Automatic compilation

It would be unpractical to do manual transformation after each change in a TypeScript file, so now we want to automate it
without using Webpack.

First I make a new tsconfig named `tsconfig.inline.json` for this use case:

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "target": "ES6"
  },
  "include": [
    "*.ts"
  ]
}
```

To compile run `./node_modules/.bin/tsc -w -p tsconfig.inline.json`. The `-w` flag keeps the process running and watches for
changes in the included TypeScript files. 


* compile multiple files - `tsc -p` (project dir)
* npm watch
* test/add tslint


@@@
Also see polygram-searchbox and webpack.config.js for PNG workaround.


# To do for this article

* Unit and e2e and coverage
* Rxjs
* Is Flow a better fit than TypeScript?
* Workaround with `/// ref style` ts imports?
* @@@ improvement? https://www.npmjs.com/package/tslint-plugin-prettier 
* Added `devtool: 'inline-source-map'` and it is possible to see both the source TS and source HTML files in Chrome. 


# long term

So for now it's solved with a separate optional attribute standaloneTerm, that 
dispatches its value to the Redux store.  
Maybe there is a better way to re-use standalone elements with optional state via Redux?

Next container wrappers for different search engines.

Next test cases and CI.
 


... write about missing features/shortcomings of Polymer ....
... also still have to try Thunk for the async calls ...


Does such a Gist works in Jekyll?
https://github.com/jekyll/jekyll-gist
<script src="https://gist.github.com/robdodson/4270ff2dbd0852b34ad849e723bc4592.js"></script>
