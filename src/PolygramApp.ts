// Importing from node_modules
//import '../bower_components/polymer/polymer-element.html'
import { format } from 'date-fns';

//import Polymer from '../bower_components/polymer/polymer-element.html';
//const Polymer = require('../bower_components/polymer/polymer-element.html');
// class StubElem {}
// const Polymer = {
//     Element: StubElem
// }; // TODO unstub / HoF/factory ... alternatively try https://github.com/aruntk/wc-loader ?
//
// console.log('PolygramApp.ts', Polymer.Element);

const label: string = 'Current Date: ';

export default class PolygramApp /*extends Polymer.Element*/ {
    static get is() { return 'polygram-app'; }
    static get properties() {
        return {
            today: {
                type: String,
                value: function() {
                    return label + format(new Date(), 'YYYY-MM-DD');
                }
            }
        }
    }
}
// window.customElements.define(PolygramApp.is, PolygramApp);