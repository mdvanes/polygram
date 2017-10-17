import ACTIONS from './state/actions';

function create(Polymer) {
    /**
     * `polygram-searchbox`
     *
     * @customElement
     * @polymer
     * @demo demo/polygram-searchbox/index.html
     */
    return class PolygramSearchbox extends /*ReduxMixin(Polymer.Element)*/ Polymer.Element {
        static get is() {
            return 'polygram-searchbox';
        }

        // TODO search type (wikipedia/images/etc) via Higher Order Component also containing the Redux bindings

        static get properties() {
            return {
                state: {
                    type: Object
                },
                sourceName: {
                    type: String,
                    value: 'polygram-searchbox'
                },
                _searchIAInput: {
                    type: String,
                    value: null,
                    observer: '_searchIAInputChanged'
                },
                _searchIAUrl: {
                    type: String,
                    value: null
                },
                _searchResultsIAArr: {
                    type: Array,
                    value: []
                }
            };
        }

        _searchIAInputChanged(term) {
            if(term && term.length > 0) {
                this._searchIAUrl = `https://cors-anywhere.herokuapp.com/en.wikipedia.org:443/w/api.php?action=query&format=json&list=search&srsearch=${encodeURI(term)}`;
            }
        }

        _searchIAHandler(data) {
            if(data && data.detail && data.detail.response && data.detail.response.query &&
                data.detail.response.query.search) {
                this._searchResultsIAArr = data.detail.response.query.search;
            }
        }

        _handleClick(e) {
            this.dispatch(ACTIONS.TERM_SELECTED.TERM_SELECTED(e.target.id));
        }

    }
}

export default { create };