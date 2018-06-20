
export class StoreBase {
    constructor() {
        this.dataBase = indexedDB.open('object', 1);
        this.dataBase.onupgradeneeded = (e) => {
            var object = this.dataBase.result.createObjectStore("people", { keyPath: 'id', autoIncrement: true });
            object.createIndex('by_name', 'name', { unique: false });
            object.createIndex('by_dni', 'dni', { unique: true });
        };

    }

    add(data) {
        let tx = this.dataBase.result.transaction(["people"], "readwrite");
        let object = tx.objectStore("people");
    

        object.put(data);

    }

}