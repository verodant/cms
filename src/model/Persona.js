import { ModelAbs } from './Model.abs.js';
export class Persona extends ModelAbs {

    static get properties() {
        return {
            id: {
                type: Number
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
                value: new Date()
            },
            prefesion: {
                type: String
            }
        }
    }

    constructor(id){
        super();
    }

}