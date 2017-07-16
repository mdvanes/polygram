# \<polygram-element\>

load photos in a instagram style

## Install the Polymer-CLI

* `nvm use 7.10.0`
* First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed.
* `polymer install`
* `npm i redux`
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

# Hello World

When running `polymer serve`, it's also possible to open [http://localhost:8081/components/polygram-element/demo/HelloWorld/](http://localhost:8081/components/polygram-element/demo/HelloWorld/) for a case comparing very basic
native webcomponents and a Polymer component. 


# TODO

* Search should return images only (and rename to polygram-searchbox)
* Add second component to show image details (polygram-details)
* Add higher level app, integrating both components next to the 2 demo pages (should be polygram-element).
* Use Redux to share data: if a search result is clicked (in polygram-searchbox) show the result (in polygram-details)
* Test cases, source maps?