var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function readonly(target, key, descriptor) {
    descriptor.writable = false;
    return descriptor;
}
/**
 * `polygram-details`
 *
 * @customElement
 * @polymer
 * @demo demo/polygram-details/index.html
 */
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
        if (term && term.length > 0) {
            this._searchIAUrl = `http://127.0.0.1:8080/en.wikipedia.org:443/w/api.php?action=query&format=json&list=search&srsearch=${encodeURI(term)}`;
        }
    }
    _searchIAHandler(data) {
        if (data && data.detail && data.detail.response &&
            data.detail.response.query && data.detail.response.query.search) {
            this._searchResult = {
                title: data.detail.response.query.search[0].title,
                url: `https://en.wikipedia.org/wiki/${data.detail.response.query.search[0].title}`,
                size: data.detail.response.query.search[0].size,
                summary: data.detail.response.query.search[0].snippet
            };
        }
    }
    foo() {
        // This works, but prepends a polyfill to the output
        return 'just testing a decorator';
    }
}
__decorate([
    readonly
], PolygramDetails.prototype, "foo", null);
window.customElements.define(PolygramDetails.is, PolygramDetails);
//# sourceMappingURL=polygram-details.js.map