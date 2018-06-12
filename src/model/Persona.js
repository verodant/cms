import { ModelAbs } from './Model.abs.js';
export class Persona extends ModelAbs {

    static get model_path() {
        return '/editorial/';
    }
    /**
     * TODO-> 
     */
    static get properties() {
        return {
            id: {
                type: Number,
                pk: true
            },
            name: {
                type: String,
                value: 'sin nombre',
                pk: true
            },
            description: {
                type: String,
                value: 'sin Descripcion'
            },
            date: {
                type: Date,
                value: new Date()
            },
            prefesion: {
                type: String
            },
            editorialData: {
                type: EditorialData,
                value: new EditorialData
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