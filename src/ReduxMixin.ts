import {createStore, combineReducers, compose} from 'redux';
//import './PolymerRedux';
const PolymerRedux = require('exports-loader?PolymerRedux!./PolymerRedux'); // TODO attempt to use polymer-loader to get from bower




/* reducers start TODO extract */
const CONSTANTS:any = {};
CONSTANTS.TERM_SELECTED = 'TERM_SELECTED';

const REDUCERS:any = {};

const initialState = {
    selectedTerm: null
};

REDUCERS.term = function (state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }

    switch (action.type) {
        // TODO refactor condition like HomeRemote
        case CONSTANTS.TERM_SELECTED:
            return Object.assign({}, state, {
                selectedTerm: action.selectedTerm
            });
        default:
            return state;
    }
};

//window.Polygram = Polygram;
/* reducers end */





/* actions start TODO extract */
const createTermActions = function() {
    var ACTIONS = {
        TERM_SELECTED : function(selectedTerm) {
            return {
                type: CONSTANTS.TERM_SELECTED,
                selectedTerm
            };
        }
    };
    return ACTIONS;
};
/* actions end */





// ReduxThunk (optional) for services and Redux Devtools for debugging with Chrome extension
export const reduxStore = createStore(
    combineReducers(REDUCERS),
    compose(
        // TODO Redux.applyMiddleware(window.ReduxThunk.default),
        // TODO fix - window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ));

//export const store;

const ACTIONS:any = {};
ACTIONS.TERM_SELECTED = createTermActions();


export const ReduxMixin = PolymerRedux(reduxStore);
// console.log(ReduxMixin1, typeof ReduxMixin1);
// export const ReduxMixin = ReduxMixin1;
//
// export const Foo = function() {
//   console.log('the foo function');
// };