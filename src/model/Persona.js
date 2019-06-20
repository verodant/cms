import { ModelAbs } from './Model.abs.js';
export class Persona extends ModelAbs.implements() {

    static get model_path() {
        return '/persona/';
    }

    static get properties() {
        return {
            id: {
                type: Number,
                value: new Date().getTime(),
                pk: true
            },
            name: {
                type: String,
                value: 'sin nombre'
            },
            description: {
                type: String,
                value: 'sin Descripcion'
            },
            date: {
                type: String,
                value: new Date().toString(),
            },
            prefesion: {
                type: String
            }
        }
    }

    constructor(id) {
        super(arguments);
        if (id) {
            this.id = id;
            this._load();
        }
    }

}

window.ModelAbs = ModelAbs;