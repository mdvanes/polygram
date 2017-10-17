// Importing from node_modules
//import '../bower_components/polymer/polymer-element.html'
import { format } from 'date-fns';
//const ReduxMixin = require('exports-loader?PolymerRedux!./ReduxMixin');

//import Polymer from '../bower_components/polymer/polymer-element.html';
//const Polymer = require('../bower_components/polymer/polymer-element.html');
// class StubElem {}
// const Polymer = {
//     Element: StubElem
// }; // TODO unstub / HoF/factory ... alternatively try https://github.com/aruntk/wc-loader ?
//
// console.log('PolygramApp.ts', Polymer.Element);

const label: string = 'Current Date: ';

// class PolygramApp /*extends Polymer.Element*/ {
//     static get is() { return 'polygram-app'; }
//     static get properties() {
//         return {
//             today: {
//                 type: String,
//                 value: function() {
//                     return label + format(new Date(), 'YYYY-MM-DD');
//                 }
//             }
//         }
//     }
// }

//const Polygram = require('imports-loader?window=>{}!exports-loader?window.Polygram!polymer-webpack-loader!./redux-mixin.html');
import {ReduxMixin, reduxStore} from './state/ReduxMixin';

function create(Polymer) {
    return class PolygramApp extends ReduxMixin(Polymer.Element) {
        // TODO needs the Redux properties from /polygram-element.html

        static get is() { return 'polygram-app'; }

        static get properties() {
            return {
                today: {
                    type: String,
                    value: function() {
                        return label + format(new Date(), 'YYYY-MM-DD');
                    }
                },
                state: {
                    type: Object,
                    value: reduxStore.getState()
                },
                selectedTerm: String
            }
        }

        ready() {
            super.ready();
            // Either do this to propagate state, or require polygram-details to extend ReduxMixin(Polymer.Element)
            // and set its property "term" to:
            //  type: String,
            //  observer: '_termChanged',
            //  statePath: 'term.selectedTerm'
            // This would also require _standaloneTermChanged to be able to set the term without Redux, e.g. on the demo page.
            this.addEventListener('state-changed', event => {
                const state = event.detail;
                this.selectedTerm = state.term.selectedTerm;
            });
        }

    }
}

export default { create }
// window.customElements.define(PolygramApp.is, PolygramApp);