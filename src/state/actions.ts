import CONSTANTS from './constants';

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

const ACTIONS:any = {
    TERM_SELECTED: createTermActions()
};

export default ACTIONS;