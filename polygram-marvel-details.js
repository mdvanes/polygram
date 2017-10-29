// Only works for pre-authenticated domains
const publicApiKey = '350837a4d90eef7a4d05c18510b694a9';
/**
 * `polygram-marvel-details`
 *
 * @customElement
 * @polymer
 * @demo demo/polygram-marvel-details/index.html
 */
class PolygramMarvelDetails extends Polymer.Element {
    static get is() {
        return 'polygram-marvel-details';
    }
    static get properties() {
        return {
            term: {
                type: String,
                observer: '_termChanged',
                value: null,
                reflectToAttribute: true // for now, just to be able to see it in the DOM console
            },
            _searchIAUrl: {
                type: String,
                value: null
            },
            _searchResult: {
                type: Object,
                value: null
            }
        };
    }
    _termChanged(term) {
        this._searchResult = null;
        if (term && term.length > 0) {
            this._searchIAUrl = `https://gateway.marvel.com:443/v1/public/characters?name=${encodeURI(term)}&apikey=${publicApiKey}`;
        }
    }
    _searchIAHandler(data) {
        const result = _.get(data, ['detail', 'response', 'data', 'results', '0']);
        if (result) {
            this._searchResult = {
                title: result.name,
                url: result.resourceURI,
                size: result.id,
                summary: result.description
            };
        }
    }
}
window.customElements.define(PolygramMarvelDetails.is, PolygramMarvelDetails);
//# sourceMappingURL=polygram-marvel-details.js.map