// Importing from node_modules
import { format } from 'date-fns';
import {ReduxMixin, reduxStore} from './state/ReduxMixin';

// import '../bower_components/polymer/polymer-element.html'
// import Polymer from '../bower_components/polymer/polymer-element.html';
// const Polymer = require('../bower_components/polymer/polymer-element.html');
// }; // Now using a Factory Pattern to import Polymer, maybe try https://github.com/aruntk/wc-loader ?

const label: string = 'Current Date: ';

function create(Polymer) {
    return class PolygramApp extends ReduxMixin(Polymer.Element) {

        static get is() { return 'polygram-app'; }

        static get properties() {
            return {
                message: {
                    type: String,
                    value: ''
                },
                selectedTerm: String,
                state: {
                    type: Object,
                    value: reduxStore.getState()
                },
                today: {
                    type: String,
                    value() {
                        return label + format(new Date(), 'YYYY-MM-DD');
                    }
                },
                useGetty: {
                    type: Boolean,
                    value: false
                },
                useMarvel: {
                    type: Boolean,
                    value: false
                },
                useWikipedia: {
                    type: Boolean,
                    value: true
                }
            };
        }

        static get observers() {
            return [
                'updateApiFilters(useGetty, useMarvel, useWikipedia)'
            ];
        }

        /**
         * Each argument is an API filter boolean
         */
        public updateApiFilters() {
            const apiFiltersArr = Array.from(arguments);
            const nrOfActiveFilters = apiFiltersArr.filter((x) => x).length;
            if (nrOfActiveFilters > 1) {
                this.message = 'Please use only one API at the time';
            } else {
                this.message = '';
            }
        }

        public _showMessage(msg) {
            return msg && msg.length > 0;
        }

        public ready() {
            super.ready();
            // Either do this to propagate state, or require polygram-details to extend ReduxMixin(Polymer.Element)
            // and set its property "term" to:
            //  type: String,
            //  observer: '_termChanged',
            //  statePath: 'term.selectedTerm'
            // This would also require _standaloneTermChanged to be able to set the term without Redux, e.g. on the demo page.
            this.addEventListener('state-changed', (event) => {
                const state = event.detail;
                this.selectedTerm = state.term.selectedTerm;
            });
        }

    };
}

export default { create };
