import { ModelAbs } from './Model.abs.js';
export class Persona extends ModelAbs {

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
                type: Date,
                value: new Date(),
            },
            prefesion: {
                type: String
            }
        }
    }



    constructor(id) {
        super();
    }

    save() {
        super.save();

    }

}