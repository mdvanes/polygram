import {createStore, combineReducers, compose} from 'redux';
declare let __REDUX_DEVTOOLS_EXTENSION__: any; // May be added by the Chrome plugin
//const Polygram = require('imports-loader?window=>{}!exports-loader?window.Polygram!polymer-webpack-loader!./redux-mixin.html');

const PolymerRedux = require('exports-loader?PolymerRedux!./PolymerRedux'); // TODO attempt to use polymer-loader to get from bower
import REDUCERS from './reducers';

// ReduxThunk (optional) for services and Redux Devtools for debugging with Chrome extension
export const reduxStore = createStore(
    combineReducers(REDUCERS),
    compose(
        // TODO Redux.applyMiddleware(window.ReduxThunk.default),
        __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__()
    ));

//export const store;
export const ReduxMixin = PolymerRedux(reduxStore);