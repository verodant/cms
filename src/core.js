export class Core {
    constructor() {
        if (new.target.name.indexOf('Abs') >= 0) throw new TypeError('No se puede invocar un constructor de una clase Abstracta');
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

}
window.Core = Core;