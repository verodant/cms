import { Core } from '/src/core.js';
import { ModelStorage } from '/src/storage/IndexedDB/ModelStorage.js';

const STORE = new WeakMap();
const CONNECTION = new ModelStorage;

export class ModelAbs extends Core.with() {
    static get properties() {
        return {};
    }

    get primaryKey() {
        return Object
            .keys(this.constructor.properties)
            .filter((item) => {
                return !!this.constructor.properties[item].pk;
            })
            .map(key => this[key])
            .join("::");
    }

    constructor(id = null) {
        super();
        if (id) return console.log('cargo de api');

        this._status = 'NEW';
        STORE.set(this, new Map());
        
        this._defineProperties();

    }

    async _defineProperties() {
        const LOCALSTORE = STORE.get(this);
        const PROPS = this.constructor.properties;
        
        a = await CONNECTION.get('Persona::1');
        console.log(a);
        
        Object
            .keys(PROPS)
            .forEach((item, key, arr) => {
                Object.defineProperty(
                    this,
                    item,
                    {
                        set: (value) => {
                            if (value !== undefined && value === LOCALSTORE.get(item)) return;
                            this._checkType(value, PROPS[item].type, item);
                            LOCALSTORE.set(item, value);
                            if (this._status && this._status == 'SAVED') this._status = "MODIFIED";
                        },
                        get: () => {
                            return LOCALSTORE.get(item)
                        },
                        enumerable: true
                    }
                );
                this[item] = PROPS[item].value || undefined;
            })
    }

    *[Symbol.iterator]() { for (let i of STORE.get(this).entries()) yield i; }

    _checkType(value, type, name = null) {
        if (type && value && !(value.__proto__ === type.prototype)) throw new TypeError(`Tipo de variable no esperado para ${name}, se esperaba un ${type}`);
    }

    _load() {
        console.log('carga datos remotos');
        this._status = 'SAVED';
    }

    reset() {
        /* TODO memento pattern */
    }

    save() {
        console.log('salvo datos remotos');
        this._status = 'SAVED';
    }

    destroy() {

    }

    delete() {

    }

}

window.CONNECTION = CONNECTION;