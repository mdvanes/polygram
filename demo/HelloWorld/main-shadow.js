class MyShadowComponent extends HTMLElement {
    constructor() {
        super();
        console.log('Constructed!');

        this._root = this.attachShadow({'mode': 'open'});
    }

    connectedCallback() {
        this._logAttributes();
        this._root.innerHTML = `
            <style>
p {
    color: red;
}
.bar-style {
    border: 1px solid #ccc;
    border-radius: 3px;
    display: inline-block;
    padding: 0.5em;
}
            </style>
            <p>Hello World (shadow)!</p>
        `;
    }

    disconnectedCallback() {
        console.log('element removed');
    }

    _logAttributes() {
        console.log('Attribute "test" has value:', this.getAttribute('test'));
    }

    static get observedAttributes() {
        return ['test'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('changed', oldValue, newValue);
        if(newValue === 'bar') {
            this.setAttribute('class', 'bar-style')
        }
    }

    // set myProperty(x) {
    //     this._myProperty = x;
    // }

    // // document.querySelector('my-component').myProperty
    // get myProperty() {
    //     return this._myProperty || 'empty';
    // }

    // click() {
    //     alert('foo' + this._myProperty);
    // }
}
window.customElements.define('my-shadow-component', MyShadowComponent);