// Importing from node_modules
import format from 'date-fns/format';
//import { format } from 'date-fns';
// @TODO to fix this import: npm i -g typings && typings install &&
// That syntax is actually deprecated, use: npm install @types/<package>
// in this case: npm install @types/date-fns
// Should not be needed: https://www.npmjs.com/package/@types/date-fns
// Maybe just update date-fns": "^1.28.5 to latest version? // nah, almost latest version
// https://www.typescriptlang.org/docs/handbook/module-resolution.html
// It's actually only doing this when the target:es6 (or es2017 in my case) in the tsconfig. Without that, it works fine.
// https://github.com/Microsoft/TypeScript/issues/8189


/* fix was

changing
import format from 'date-fns/format';
to
import { format } from 'date-fns';

there is still a compiler warning in the IDE, adding this to tsconfig.json helps:
"moduleResolution": "node"
 */


/*
"scripts": {
    "postinstall": "npm run typings",
    "typings": "typings install",
}
 */

//import Polymer from '../bower_components/polymer/polymer-element.html';
//const Polymer = require('../bower_components/polymer/polymer-element.html');
// class StubElem {}
// const Polymer = {
//     Element: StubElem
// }; // TODO unstub / HoF/factory ... alternatively try https://github.com/aruntk/wc-loader ?
//
// console.log('PolygramApp.ts', Polymer.Element);

export default class PolygramApp extends Polymer.Element {
    static get is() { return 'polygram-app'; }
    static get properties() {
        return {
            today: {
                type: String,
                value: function() {
                    return format(new Date(), 'MM/DD/YYYY');
                }
            }
        }
    }

    // test() {
    //     return format(new Date(), 'YYYY-MM-DD');
    // }
}
// window.customElements.define(PolygramApp.is, PolygramApp);