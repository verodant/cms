export class Core {
    constructor(_class) {
        if (new.target.name.indexOf('Abs') >= 0) throw new TypeError('No se puede invocar un constructor de una clase Abstracta');
        return _class;
    }

    set(name, value) {
        this[name] = value;
    }

    get(name) {
        return this[name];
    }

    static with(...mixins) {
        return mixins.reduce((c, mixin) => mixin(c), Core);
    }

    static implements(..._interfaces) {
        /* TODO - funcionalidad para interfaces */
        return this;
    }

    static otra_fun(...args) {
        return this;
    }
}
window.Core = Core;