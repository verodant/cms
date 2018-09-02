import { Persona } from './model/Persona.js';

const prueba = new Persona();
console.log(prueba.primaryKey)
window.prueba = prueba;
window.Persona = Persona;
window.a = new Persona(1);


