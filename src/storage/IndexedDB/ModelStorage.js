let INSTANCE = null;
const BBDDNAME = 'CMS-BBDD';
const BBDDBUCKETNAME = 'models'


export class ModelStorage {
    constructor() {
        if (INSTANCE) return INSTANCE;
        INSTANCE = this;
        this.dataBase = null;
        this._loadBBDD();
    }

    _loadBBDD() {
        this.dataBase = indexedDB.open(BBDDNAME, 1);
        this.dataBase.onupgradeneeded = (e) => {
            let principal = this.dataBase.result.createObjectStore(BBDDBUCKETNAME, { keyPath: 'primaryKey', unique: true });
            let garbage = this.dataBase.result.createObjectStore(`${BBDDBUCKETNAME}-garbage`, { autoIncrement: true });

        };
    }

    delete() {

    }

    set(primaryKey, value) {
        this.dataBase.result
            .transaction([BBDDBUCKETNAME], 'readwrite')
            .objectStore(BBDDBUCKETNAME).put({ primaryKey, ...value });

    }

    get(primaryKey) {
        return new Promise(success => {
            this.dataBase.onsuccess = e => {
                this.dataBase.result
                    .transaction([BBDDBUCKETNAME], "readonly")
                    .objectStore(BBDDBUCKETNAME)
                    .get(primaryKey)
                    .onsuccess = function () {
                        success(this.result);
                    };
            };
        })


        /*const tx = await this.dataBase.result.transaction([BBDDBUCKETNAME], 'readonly');
        tx.objectStore(BBDDBUCKETNAME).get(primaryKey);*/

    }
}
window.ModelStorage = ModelStorage;