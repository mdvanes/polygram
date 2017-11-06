import { CustomElement } from 'twc/polymer';
import 'bower:iron-ajax/iron-ajax.html';
import 'bower:polymer/polymer-element.html';
import './polygram-ui-details';

/**
 * `polygram-details`
 *
 * @customElement
 * @polymer
 * @demo demo/polygram-details/index.html
 */
@CustomElement()
class PolygramDetails extends Polymer.Element {
    static get is() {
        return 'polygram-details';
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
        if(term && term.length > 0) {
            this._searchIAUrl = `https://cors-anywhere.herokuapp.com/en.wikipedia.org:443/w/api.php?action=query&format=json&list=search&srsearch=${encodeURI(term)}`;
        }
    }
    _searchIAHandler(data) {
        if(data && data.detail && data.detail.response &&
            data.detail.response.query && data.detail.response.query.search) {
            this._searchResult = {
                title: data.detail.response.query.search[0].title,
                url: `https://en.wikipedia.org/wiki/${data.detail.response.query.search[0].title}`,
                size: data.detail.response.query.search[0].size,
                summary: data.detail.response.query.search[0].snippet
            }
        }
    }

    template() {
        return `
            <polygram-ui-details term="[[term]]" search-result="[[_searchResult]]"></polygram-ui-details>
            <iron-ajax
                auto
                id="searchIARequest"
                url="{{_searchIAUrl}}"
                handle-as="json"
                debounce-duration="500"
                on-response="_searchIAHandler"></iron-ajax>
        `;
    }
}
window.customElements.define(PolygramDetails.is, PolygramDetails);