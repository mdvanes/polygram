/*
https://github.com/Draccoz/twc
https://pl.linkedin.com/in/buslowicz
https://github.com/Draccoz/twc/wiki/Creating-a-simple-component

https://github.com/mlisook/generator-polymer-init-twc-app
https://github.com/mlisook/generator-polymer-init-twc-app/blob/master/generators/app/templates/src/_element/_element.ts
 */

/*
Build with:
nvm use
../node_modules/.bin/twc polygram-twc.ts
 */

import { CustomElement } from 'twc/polymer';
import 'bower:polymer/polymer-element.html';

/**
 * `online-state`
 * Lets you select an online state (online or offline) and reflect the change on a host attribute.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
@CustomElement()
class OnlineState extends Polymer.Element {
    prop1: string = 'online-state';

    template() {
        return `
          <style>
            :host {
              display: block;
            }
          </style>
          <h2>Hello [[prop1]]!</h2>
        `;
    }
}