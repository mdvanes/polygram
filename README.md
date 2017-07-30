# \<polygram-element\>

Load photos in Instagram style

## Install the Polymer-CLI

* `nvm use 7.10.0`
* First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed.
* `npm i` will install npm and polymer dependencies
* Then run `polymer serve` to serve your element locally.

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

Expected dir structure?

+
|-node_modules (dir)
|
|- a(dir)
    |- b (dir)
        |
        |-[contents of bower_components, e.g. iron-demo-helpers\]
        |
        |-e.g. "project" (dir)
            |
            |-demo (dir)
                |- index.html
            |
            |-polygram-element.html, redux-mixin.html


* Copy a subset of the files before deploying to hosting; build script that makes all the paths in demo/index.html resolve
* Add Thunk for API calls
* Test cases, source maps (bundler?), breakpoints (breakpoints work)?
* Hydrolysis (now [Polymer Analyzer](https://github.com/Polymer/polymer-analyzer), used by linter and builder. 
* Vulcanisation (now [Polymer Bundler??](https://github.com/Polymer/polymer-bundler)), used for packaging.
* Higher order components for switching APIs (e.g. Wiki, Getty en Marvel?)
* Add Ramdba to Redux, see [this article](https://alligator.io/react/functional-redux-reducers-with-ramda/).
* improvement paper-autocomplete?




