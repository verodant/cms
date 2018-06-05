import { Core } from '/src/core.js';
import { IndexedDBStorage } from '/src/IndexedDBStorage.js';

const STORE = new WeakMap();
const CONNECTION = new IndexedDBStorage('model');
class a {
  constructor(){
      this.kk = 'kakita';
  }
};

class b {
    constructor(){
        this.qq = 'qaqita';
    }
  };

window.a = a;
window.b = b;
export class ModelAbs extends Core.with2(a,b) {
    static get properties() {
        return {};
    }

    static get model_path() {
        return `ruta_api_modelo`;
    }

    constructor() {
        super();
        this._status = 'NEW';
        STORE.set(this, new Map());
        this._defineProperties();
        /* CONNECTION.getWarehouse(new.target.name); */
    }

    _defineProperties() {
        const LOCALSTORE = STORE.get(this);
        const PROPS = this.constructor.properties;

        Object
            .keys(PROPS)
            .forEach((item, key, arr) => {
                Object.defineProperty(this, item, {
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
                });
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

    }

    save() {
        console.log('salvo datos remotos');
        this._status = 'SAVED';
    }

}