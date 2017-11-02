/*
https://github.com/Draccoz/twc
https://pl.linkedin.com/in/buslowicz
https://github.com/Draccoz/twc/wiki/Creating-a-simple-component

https://github.com/mlisook/generator-polymer-init-twc-app
https://github.com/mlisook/generator-polymer-init-twc-app/blob/master/generators/app/templates/src/_element/_element.ts
 */


// ./node_modules/.bin/twc polygram-twc.ts

import "~bower_components/polymer/polymer-element.html";
import { CustomElement, attr, compute, notify, observe, style, template } from 'twc/dist/targets/polymer2';

@CustomElement()
export class MyElement extends Polymer.Element {
    name: string;
}