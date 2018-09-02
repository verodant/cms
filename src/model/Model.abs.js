import { Core } from "/src/core.js";
import { FetchStorage } from "/src/storage/Fetch/FetchStorage.js";

/**
 * Definicion de las constantes del modulo
 *  - Storage
 *  - Connection 
 */
const STORE = new WeakMap();
const CONNECTION = new FetchStorage();

/**
 * @description Clase encargada de gestionar cualquier tipo de modelo
 *
 * @export
 * @class ModelAbs
 * @extends {Core.with()}
 */
export class ModelAbs extends Core.with() {
  /**
   * @description Definicion de las propiedades desde cada modelo, contola si es pk, tipo de dato, etc...
   *
   * @readonly
   * @static
   * @memberof ModelAbs
   */
  static get properties() {
    return {};
  }

  /**
   * @description Creates an instance of ModelAbs.
   * @memberof ModelAbs
   */
  constructor() {
    super();

    this.status = "NEW";
    STORE.set(this, new Map());

    this._defineProperties();

  }

  /**
   * @description Clave primaria del modelo
   * @returns {String} 
   * @readonly
   * @memberof ModelAbs
   */
  get primaryKey() {
    return (
      this.constructor.name +
      "::" +
      Object.keys(this.constructor.properties)
        .filter(item => !!this.constructor.properties[item].pk)
        .map(key => this[key] || this.constructor.properties[key].value)
        .join("::")
    );
  }

  /**
   *
   * @returns {Object} Datos en bulk del modelo
   * @readonly
   * @memberof ModelAbs
   */
  get data() {
    const ret = {};
    for (const [prop, value] of this) {
      ret[prop] = value;
    }
    return ret;
  }

  /**
   * @description Devuelve el estado del objeto con respecto al storage remoto
   *
   * @returns {String}
   * @memberof ModelAbs
   */
  get status() {
    return this._status;
  }

  /**
   * @description Setea el estado del modelo con respecto al storage
   * 
   * @returns {String} 
   * @memberof ModelAbs
   */
  set status(status) {

    switch (status) {
      case 'NEW':
        if (!!this.status) throw new Error('No puede estar en estado Nuevo este objeto');
        this._status = status;
        break;
      case 'SAVED':
        this._status = status;
        break;
      case 'MODIFIED':
        if (this._status == "SAVED") this._status = status;
        break;
      default:
        console.warn('tipo de stado desconocido');
    }

  }

  /**
   * @description Metodo privado que define todas las propiedades y comprueba su viabilidad
   *
   * @memberof ModelAbs
   */
  _defineProperties() {
    const PROPS = this.constructor.properties;

    Object.keys(PROPS).forEach((item) => {
      this._defineProperty(item);
      this.set(item, PROPS[item].value || undefined);
    });
  }

  /**
   * @description Define las propiedades en el modelo
   * @param {Object} item propiedad a creear
   */
  _defineProperty(item) {
    const INSTANCESTORE = STORE.get(this);
    const PROPS = this.constructor.properties;
    
    Object.defineProperty(this, item, {
      set: value => {
        if (value !== undefined && value === INSTANCESTORE.get(item)) return;
        this._checkType(value, PROPS.type, item);
        INSTANCESTORE.set(item, value);
        this.status = "MODIFIED";
      },
      get: () => (INSTANCESTORE.get(item)),
      enumerable: PROPS[item].enumerable || true
    });
  }

  /**
   * Generador para iteracion asincrona (for of)
   *
   * @memberof ModelAbs
   */
  *[Symbol.iterator]() { for (let i of STORE.get(this).entries()) yield i; }

  /**
   * @description Comprueba el tipo de la variable. Tipado. Lanza excepcion si no puede evaluar correctamete.
   *
   * @param {*} value valor de la variable a evaluar
   * @param {*} type cualquier tipo de variable para evaluar con value
   * @param {String} [name=null] Nombre de la variable
   * @memberof ModelAbs
   */
  _checkType(value, type, name = null) {
    if (type && value && !(value.__proto__ === type.prototype)) {
      throw new TypeError(`Tipo de variable no esperado para ${name}, se esperaba un ${type}`);
    }
  }

  /**
   * @description trae datos remotos de un modelo
   * 
   * @async
   * @memberof ModelAbs
   */
  async _load() {
    const data = await CONNECTION
      .setPath(`${this.constructor.model_path}${this.id}.json`)
      .get();

    Object.keys(data).forEach(item => {
      this.set(item, data[item]);
    });

    this.status = "SAVED";
  }

  /**
   * @description guarda datos en remoto de un modelo
   * 
   * @async
   * @memberof ModelAbs
   */
  async _save() {
    const data = await CONNECTION
      .setPath(`${this.constructor.model_path}${this.id}.json`)
      .set(this.data);

    this.status = "SAVED";
  }

  /**
   * @description Metodo para borrar esta instancia
   *
   * @memberof ModelAbs
   */
  destructor() { }

  /**
   * @description Metodo para eliminar el modelo en el Stoage Remoto
   *
   * @memberof ModelAbs
   */
  delete() {
    STORE.delete(this);
  }
}
