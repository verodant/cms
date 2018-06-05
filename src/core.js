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

    static with2(baseClass, ...mixins) {

        let base = class _Combined extends baseClass {
            constructor(...args) {
                super(...args)
                mixins.forEach((mixin) => {
                    mixin.prototype.initializer.call(this)
                })
            }
        }
        let copyProps = (target, source) => {
            Object.getOwnPropertyNames(source)
                .concat(Object.getOwnPropertySymbols(source))
                .forEach((prop) => {
                    if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                        return
                    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
                })
        }
        mixins.forEach((mixin) => {
            copyProps(base.prototype, mixin.prototype)
            copyProps(base, mixin)
        })
        return base
    }

    static with(...classes) {

        let aux = Base => class extends clase { };

        //return class extends Core{};
        let kk = classes.reduce((baseclass, classToExtend) => {
            class myClass extends baseclass { };
            class myClass2 extends classToExtend { };
            return myClass2;
        }, Core);

        return kk;
    }

}
window.Core = Core;



require(['modules/utils/Cookie'],function(Cookie){
    
})