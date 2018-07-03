let INSTANCE = null;
const BBDDNAME = 'CMS-BBDD';
const BBDDBUCKETNAME = 'models';
const VERSION = 1;


export class ModelStorage {
    constructor() {
        if (INSTANCE) return INSTANCE;
        INSTANCE = this;
        this.dataBase = this._loadBBDD();
    }

    _loadBBDD() {
        return new Promise(success => {
            let dataBase = indexedDB.open(BBDDNAME, VERSION);
            dataBase.onsuccess = function () {
                success(dataBase);
            };
            dataBase.onupgradeneeded = (e) => {
                let principal = dataBase.result.createObjectStore(BBDDBUCKETNAME, {
                    keyPath: 'primaryKey',
                    unique: true
                });
                let garbage = dataBase.result.createObjectStore(`${BBDDBUCKETNAME}-garbage`, {
                    autoIncrement: true
                });

            };

        });


    }

    delete() {

    }

    set(primaryKey, value) {
        this.dataBase.then(dataBase => {
            const objecStore = dataBase.result
                .transaction([BBDDBUCKETNAME], 'readwrite');

            objecStore.objectStore(BBDDBUCKETNAME).put({
                primaryKey,
                ...value
            });
        })
    }

    get(primaryKey) {
        return new Promise((success) => {
            this.dataBase.then(dataBase => {
                console.log(dataBase.result);
                let tx = dataBase.result
                    .transaction([BBDDBUCKETNAME], "readonly");
                let store = tx.objectStore(BBDDBUCKETNAME)
                console.log('pk-=>>', primaryKey)
                let req = store.get(primaryKey)
                req.onsuccess = function (e) {
                    console.log(e)
                    console.log('succes de la transition', req.result)
                    success(req.result);
                }
            })

        })
    }
}
window.ModelStorage = ModelStorage;