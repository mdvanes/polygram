# \<polygram-element\>

Load photos in Instagram style

Visit demo on [firebase](https://polygram-694a7.firebaseapp.com/a/bower_components/project/demo/)


## Install the Polymer-CLI

* `nvm use`
* First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed.
* `npm i` will install npm and polymer dependencies
* For the non-TypeScript versions: Then run `polymer serve` to serve your element locally.
* For the TypeScript versions with Webpack (full app): 
    * `npm run dev`
    * http://localhost:9000/
* For the TypeScript versions with typescript-batch-compiler (single component):
    * `./node_modules/.bin/typescript-batch-compiler` and modify a TS file (e.g. polygram-marvel-details.ts) (note that `./node_modules/.bin/typescript-batch-compiler -b` will try to build TS files that should be out of scope. Make "ignore" dir configurable)
    * JS will be generated in the same dir (e.g. for polygram-marvel-details.ts)
    * HTML imports the JS
    * `polymer serve`
    * HTML is imported by demo page (e.g. http://localhost:8081/components/polygram-element/demo/polygram-marvel-details/)
* For the TypeScript versions with twc:
    * in the twc dir build with `../node_modules/.bin/twc polygram-twc.ts`
    * A polygram-twc.html is created.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.


## Deploying

Deployed to Firebase, see [installation manual](https://firebase.google.com/docs/cli/).

<!-- * run `polymer build` (TODO WIP) -->
* run `npm run build`
* run `http-server` and test in http://localhost:8080/a/bower_components/project/demo/
* run `firebase deploy --only hosting`
* visit on: https://polygram-694a7.firebaseapp.com/a/bower_components/project/demo/

# Hello World

When running `polymer serve`, it's also possible to open [http://localhost:8081/components/polygram-element/demo/HelloWorld/](http://localhost:8081/components/polygram-element/demo/HelloWorld/) for a case comparing very basic
native webcomponents and a Polymer component. 


# TODO

* 3-10 Webpack http://robdodson.me/how-to-use-polymer-with-webpack/
    * advantage: can import node_module with `import` syntax
    * uses babel
    * run with `npm run dev` or ```./node_modules/.bin/webpack-dev-server --config webpack.config.js```
    * run in other terminal: `node proxy.js` for the CORS Anywhere proxy
* improve styling a bit with https://www.webcomponents.org/element/PolymerElements/paper-styles and https://www.webcomponents.org/element/PolymerElements/paper-card/demo/demo/index.html
* sources: Firebase, Meetup.com, Medium.com, Youtube, Twitter
* Higher order components for switching APIs (e.g. Wiki, Getty en Marvel?)
* 10-10 TypeScript
    * https://github.com/daflair/nerdy-stack-client/blob/feature/Nerdy_Components_Prototype_1/components/hello-world.tsx
    * tslint
* 17-10 typescript + polymer in CI
* 31-10 typescript + scala mapping
* rxjs + web sockets
* Add Thunk for API calls
* Add Ramdba to Redux, see [this article](https://alligator.io/react/functional-redux-reducers-with-ramda/).
* Test cases, source maps (bundler?), breakpoints (breakpoints work)?
* Hydrolysis (now [Polymer Analyzer](https://github.com/Polymer/polymer-analyzer), used by linter and builder. 
* Vulcanisation (now [Polymer BuAddedAddedAddndler??](https://github.com/Polymer/polymer-bundler)), used for packaging.
* improvement paper-autocomplete?



# follow-up, conversion to Poly 3

nvm use
npm install -g polymer-modulizer
what does it do? convert HTML to ES modules, which matches Polygram 3 (this is not in the docs, but based on comment of Tim van der Lippe)
I will test package mode of the modulizer
make a new dir polygram-modulizer-test next to the project dir 
copy twc/polygram-details.html (this is equal to ./polygram-details.html in the master branch, the original version) to the new dir polygram-modulizer-test
copy bower.json to the new dir
in the new dir run 
git init (a git repo is required) and commit changes + ignore bower_components
bower cache clean && bower install
modulizer --out .
This already succeeds with:
```
? npm package name? @polymer/polygram-element
? npm package version? 
[1/2] 🌀  Converting Package...
Out directory: /Users/mdvanes/Documents/OSS/polygram-modulizer-test
WARN: bower->npm mapping for "polymer-redux" not found
[2/2] 🎉  Conversion Complete!
```
This was not enough: the end result should be the ES6 module and this means a JS file, but for some
reason the HTML was modified. 
For sure, this has to do with:
> 1. All dependencies must be available as modules to convert.

Nevertheless, this looks very promising.

## Typings

There are typings for Poly 2 core, should be in the 2.4 release. Currently in RC.
This should make it possible to import (should it?) dependencies, mainly
`Polymer` itself without the factory workaround.
Or actually `declare const Polymer: any;`
which means this multiple declaration because of scoping would not occur.
which means polymer-batch-compiler is not needed?

## Decorators