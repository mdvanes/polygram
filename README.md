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

# Hello World

When running `polymer serve`, it's also possible to open [http://localhost:8081/components/polygram-element/demo/HelloWorld/](http://localhost:8081/components/polygram-element/demo/HelloWorld/) for a case comparing very basic
native webcomponents and a Polymer component. 


# TODO

* Higher order components for switching APIs (e.g. Wiki, Getty en Marvel?)
* Test cases, source maps?
* improvement paper-autocomplete?


# Talk

... write about comparison between native web components and polymer ...

When looking into Polymer for Web Components, to share state between components, Redux seems like a pretty good fit.

I've found the docs on [Polymer Redux](https://tur-nr.github.io/polymer-redux/docs), but they don't really go into
details of implementation.

Also there is [this Polycast video](https://youtu.be/PahsgJn0sgU) but it applies to Polymer 1.x and I wanted
to apply it to Polymer 2.

In my [example project Polygram](https://github.com/mdvanes/polygram), everything went well from building two
  separate components, one that provides a search functionality (polygram-searchbox) and the other a detailed view (polygram-details)
  and defining actions, reducers, the store, and dispatching events work.
  
  
... Diagram of how the (immutable) state is updated ...
Click a search result
dispatch is triggered
store is updated (visible in Redux devtools)
but the value is not updated in the details view. The observer on state is not triggered.
  
In the repo for Polymer Redux is a demo for [ready-state](https://github.com/tur-nr/polymer-redux/blob/master/demo/ready-state.html)
 which shows how to initialise and pass the state. This is a very minimal but complete implementation
 that has an observer on a field, when changing this field it emits a dispatch, that updates the state
 and some other field refers to the state and updates its value. This is where I found the 
 statePath property from Polymer Redux. It allows a component to bind a property directly to the state.
 
Next up is to make the components function individually. Because at this point the demo page works where
both components are integrated, but it only initializes the Redux store there and not on the separate pages.
So I find that I have to move certain parts of the initialization (mainly this:
```
(function(Polygram) {
    // ReduxThunk (optional) for services and Redux Devtools for debugging with Chrome extension
    const store = Redux.createStore(
        Redux.combineReducers(Polygram.REDUCERS),
        Redux.compose(
            // TODO Redux.applyMiddleware(window.ReduxThunk.default),
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

    Polygram.reduxStore = store;

    Polygram.ACTIONS = Polygram.ACTIONS || {};
    Polygram.ACTIONS.TERM_SELECTED = Polygram.createTermActions();
})(window.Polygram || {});

const ReduxMixin = PolymerRedux(Polygram.reduxStore);
```
)
from polygram-element to the demo (or app) html that applies polygram-element. Now the same can be done for the
demo pages of polygram-searchbox and polygram-details to make sure ReduxMixin (and with it a reduxStore) is 
available when running integrated as well as individually on an demo page. 
Since not only this snippet but also some libraries (polymer-redux, the reducer and action) are needed in each 
instance, these are extracted to a new file: redux-mixin.html

Now the project works, you can use the Chrome plugin [Redux Devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) to do "timetravel" debugging.
You can try it out by 
* opening Redux Devtools
* search for "Cat"
* click one of the results, e.g. "Bengal Cat"
* click another result, e.g. "Schrödinger's cat"
* now inspect the TERM_SELECTED entries in the Redux Devtools and click "jump" on the one that set "Bengal Cat".
* The entire state is now reverted to that point. It's easy to imagine how this can be helpful with debugging
 a big application, and it is even more helpful that state can be exported and imported.
* dont forget to fastforward the debugger after you're done debugging! Otherwise you won't be able to use the application normally.

Polymer uses bower for depencencies, because there is long running issue with dependencies {refer to issue}.
Unfortunately to use Redux, the redux dependency must be installed with npm (the bower packages does not contains a dist version).
To provide for this I added a package.json to the project that has an postinstall hook that runs ```polymer serve```.
So for installation, now use ```npm install``` and then both npm and polymer dependencies are installed
and afterwards the server can be started normally with ```polymer serve```.

Next container wrappers for different search engines.

Next test cases and CI.
 


... write about missing features/shortcomings of Polymer ....
... also still have to try Thunk for the async calls ...
