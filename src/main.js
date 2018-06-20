import { Persona } from './model/Persona.js';

const prueba = new Persona();

window.prueba = prueba;
window.Persona = Persona;
 
import { StoreBase } from './storage/IndexedDB/IndexedDBStorage.js'

window.StoreBase = StoreBase;