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

    static with(classToExtend) {

        let aux = Base => class extends Base { };

        console.log(class extends aux(classToExtend){});

        return  (classToExtend) => class extends Base { };

        

        //return classes.reduce((acc,i)=>class extends i{});

        return classes.reduce((baseclass, classToExtend) => {
            return class extends classToExtend { };
        }, Core);

    }

}
window.Core = Core;