import {
  Core
} from "/src/core.js";
//*import { FetchStorage } from "/src/storage/Fetch/FetchStorage.js";

/**
 * Definicion de las constantes del modulo
 *  - Storage
 *  - Connection 
 */
const STORE = new WeakMap();
//const CONNECTION = new FetchStorage();

/**
 * @description Clase encargada de gestionar cualquier tipo de modelo
 *
 * @export
 * @class ModelAbs
 * @extends {Core}
 */
export class ModelAbs extends Core {
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
   * @returns {Object} Datos en bruto del modelo
   * @readonly
   * @memberof ModelAbs
   */
  get data() { return Object.fromEntries(this) }

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
   * @description Setea el estado del modelo con respecto al storage remoto
   * 
   * @returns {String} 
   * @memberof ModelAbs
   */
  set status(status) {

    switch (status) {
      case 'NEW':
        if (!!this.status) throw new Error('No puede estar en estado Nuevo este objeto');
      case 'SAVED':
        this._status = status;
        break;
      case 'MODIFIED':
        if (this._status == "SAVED") {
          this._status = status;
          console.log('pepepepepep')
        };
        break;
      default:
        console.warn('tipo de stado desconocido -> ' + status);
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
        this._checkValueViability(PROPS[item], value);
        INSTANCESTORE.set(item, value);
        this.status = "MODIFIED";
      },
      get: () => (INSTANCESTORE.get(item)),
      enumerable: PROPS[item].enumerable || true
    });
  }

  /**
   * @description Comprueba la viabilidad del valor para esa propiedad
   *
   * @param {*} value valor de la variable a evaluar
   * @param {*} prop cualquier tipo de variable para evaluar con value
   * @memberof ModelAbs
   * @throws TypeError
   */
  _checkValueViability(prop, value) {
    this._checkType(prop.type, value);
    this._checkValidation(prop.validation, value);
  }

  /**
   * @description Comprueba que el valor de la propiedad cumple con el resultado (Boolean) de la funcion.
   *
   * @param {*} prop 
   * @param {*} value 
   * @throws TypeError
   * @memberof ModelAbs
   */
  _checkValidation(validation, value) {
    if (!!validation && typeof validation == 'function' && !validation.call(this, value))
      throw new TypeError(`El valor para la variable no cumple la funcion de validacion: ${validation.toString()}`);
  }

  /**
   * @description Comprueba el tipo de la variable* 
   * 
   * @param {*} type cualquier tipo de variable para evaluar
   * @param {*} value cualquier valor  para evaluar su tipo
   * @throws TypeError
   * @memberof ModelAbs
   */
  _checkType(type, value) {
    if (!!type && !!value && !(value.__proto__ === type.prototype)) {
      throw new TypeError(`El valor para la variable no es del tipo: ${type.name}`);
    }
  }

  /**
   * Generador para iteracion, asegura recorrer solo los elementos del modelo almacenados
   *
   * @memberof ModelAbs
   * @return {Array.entries} [key,value] 
   */
  *[Symbol.iterator]() {
    for (let i of STORE.get(this).entries()) yield i
  }

  /**
   * @description trae datos remotos de un modelo
   * 
   * @async
   * @memberof ModelAbs
   */
  async _load() {
    /* const data = await CONNECTION
      .setPath(`${this.constructor.model_path}${this.id}.json`)
      .get();

    Object.keys(data).forEach(item => {
      this.set(item, data[item]);
    }); */
    this.status = "SAVED";
  }

  /**
   * @description guarda datos en remoto de un modelo
   * 
   * @async
   * @memberof ModelAbs
   */
  async _save() {
    /* const data = await CONNECTION
      .setPath(`${this.constructor.model_path}${this.id}.json`)
      .set(this.data); */
    this.status = "SAVED";
  }

  /**
   * @description Metodo destructor
   *
   * @memberof ModelAbs
   */
  destructor() {
    console.log('me destruyo', this)
  }

  /**
   * @description Metodo para eliminar el modelo en el Storage
   *
   * @memberof ModelAbs
   */
  delete() {
    STORE.delete(this);
  }
}