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
to modify the paths to the bower_components and it would basically work. Except for Redux, because @TODO



The article uses Babel and import from npm modules. Was easy to migrate, but loses polyserve / the poly serve/demo pages / polylint still possible? wct still possible? @

# Adding ts-loader

Normally, to migrate from JavaScript to TypeScript with Webpack, it would be enough to add the [ts-loader] to the Webpack
config and to rename the JavaScript files to TypeScript files. 

So I started with changing the extention for the bootstrapping index.js and adding .ts as a resolved extension:

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
    use: 'ts-loader'
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
ES target is ES3, but it's no problem to use ESNext here, because we can add Babel transpilation later.

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
`error TS1192: Module ''date-fns/format'' has no default export.` but at this point

* ide warning
* error in the browser

...

I first thought that this was caused by missing typings for the date-fns library, so I tried
`npm install @types/date-fns` but this logs that date-fns actually provides typings.

Then changed in polygramApp.ts

`import format from 'date-fns/format';`

to

`import { format } from 'date-fns';`

That fixes the runtime error.





It works with babel, but fails with ts
Warning in the IDE: 
TS2307 Cannot find module date-fns
Compliation succeeds
and
Runtime error that
(2,8): error TS1192: Module ''date-fns/format'' has no default export.


In the tsconfig.json added `"moduleResolution": "node"` to compilerOptions, that fixes the IDE warning.


## Failing Polymer.Element import
HOF/Factory
Next problem: ts file does not import the html imports (code example) like Polymer.Element. Stubbed it and that compiles. Next step: HOF that accepts the html imports


# App vs Element
One thing to do Typescript for poly app, other thing for reusable poly component.
The current solution will generate a compiled app, but does not allow importing (check?) and how about lazy loading?


Demos and stuff are now gone

# To do for this article

* Fix Redux
* Linting
* Unit and e2e and coverage
* Rxjs

The way that TSLint was now added to Webpack, means that it will only lint TS that is not embedded in HTML (I assume:)
```javascript
new TSLintPlugin({
            files: ['./src/**/*.ts'] // TODO so, this requires all the .ts not to be inline in HTML?
        })
```

Added `devtool: 'inline-source-map'` and it is possible to see both the source TS and source HTML files in Chrome. 

* Flow better?
* workaround with `/// ref style` ts imports?


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
