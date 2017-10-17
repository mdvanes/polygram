import CONSTANTS from './constants';

const createTermActions = function() {
    const createdActions = {
        TERM_SELECTED(selectedTerm) {
            return {
                selectedTerm,
                type: CONSTANTS.TERM_SELECTED
            };
        }
    };
    return createdActions;
};

const ACTIONS: any = {
    TERM_SELECTED: createTermActions()
};

export default ACTIONS;
