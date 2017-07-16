class MyShadowComponent extends HTMLElement {
    constructor() {
        super();
        this._root = this.attachShadow({mode: 'open'});
        console.log('MyShadowComponent constructed!');
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
        console.log('Attribute "test" on my-shadow-component has value:', this.getAttribute('test'));
    }

    static get observedAttributes() {
        return ['test', 'my-property'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        //console.log('changed', oldValue, newValue);
        this._logAttributes();
        if(newValue === 'bar') {
            this.setAttribute('class', 'bar-style')
        }
    }

    // document.querySelector('my-shadow-component').myProperty = 'nopolymer'
    set myProperty(x) {
        this._myProperty = x;
    }

    // document.querySelector('my-shadow-component').myProperty
    get myProperty() {
        return this._myProperty || 'empty';
    }

    // click() {
    //     alert('foo' + this._myProperty);
    // }
}
window.customElements.define('my-shadow-component', MyShadowComponent);