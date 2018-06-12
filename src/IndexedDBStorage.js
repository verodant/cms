const INSTANCES = new WeakMap();

export class IndexedDBStorage {
    constructor(name) {

        if (INSTANCES.has(name)) return INSTANCES.get(name);
        INSTANCES[name] = this;

        this.BBDDName = name;
        this.req = indexedDB.open(name, 1);
        this.req.onupgradeneeded = this.onupgradeneeded;
        this.req.onerror = this.req.onerror;
    }

    getWarehouse(name) {
        return this._ware
    }

    onupgradeneeded(event) {
        /* console.log('upgrade');
         let db = event.target.result;
         
         let objectStore = db.createObjectStore("almacen", { keyPath: "ssn" });
         
         objectStore.createIndex("id", "id", { unique: true });
       
          objectStore.transaction.oncomplete = function(event) {
           let customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
           for (let i of this._data) {
             customerObjectStore.add(this._data[i]);
           }
         } */
    };
}
