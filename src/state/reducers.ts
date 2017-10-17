import CONSTANTS from './constants';

const REDUCERS: any = {};

const initialState = {
    selectedTerm: null
};

REDUCERS.term = function(state, action) {
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

export default REDUCERS;
