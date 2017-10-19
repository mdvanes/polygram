import {combineReducers, compose, createStore} from 'redux';
declare let __REDUX_DEVTOOLS_EXTENSION__: any; // May be added by the Chrome plugin

// const PolymerRedux = require('exports-loader?PolymerRedux!polymer-webpack-loader!debug-loader?id=raw!../../bower_components/polymer-redux/dist/polymer-redux.html');
// tslint:disable-next-line
const PolymerRedux = require('exports-loader?PolymerRedux!../../bower_components/polymer-redux/dist/polymer-redux.html');
// import PolymerRedux from 'exports-loader?PolymerRedux!../../bower_components/polymer-redux/dist/polymer-redux.html';
// const PolymerRedux = require('exports-loader?PolymerRedux!debug-loader?id=raw!../../bower_components/polymer-redux/dist/polymer-redux.html');
// FALSE --- Seems to ignore the lines with the <script> tags on it, which includes the `var PolymerRedux =` part...
// Actually seems to add lines to the beginning of the raw import ?? Possibly: https://github.com/babel/babel/issues/4709
// const PolymerRedux1 = require('exports-loader?PolymerRedux!debug-loader?id=raw2!./PolymerRedux');

import REDUCERS from './reducers';

// ReduxThunk (optional) for services and Redux Devtools for debugging with Chrome extension
export const reduxStore = createStore(
    combineReducers(REDUCERS),
    compose(
        // TODO Redux.applyMiddleware(window.ReduxThunk.default),
        __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__()
    ));

// export const store;
export const ReduxMixin = PolymerRedux(reduxStore);
