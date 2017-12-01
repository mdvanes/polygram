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
* Vulcanisation (now [Polymer Bundler??](https://github.com/Polymer/polymer-bundler)), used for packaging.
* improvement paper-autocomplete?
