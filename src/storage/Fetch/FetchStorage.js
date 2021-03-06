export class FetchStorage {
    constructor() {

    }

    get config() {
        return {
            method: this.method,
            headers: this.headers || new Headers(),
            mode: 'cors',
            cache: 'default'
        }
    }

    setHeaders(headers) {
        this.headers = headers;
        return this;
    }

    setPath(path) {
        this.path = path;
        return this;
    }

    get() {
        this.method = 'GET';
        return new Promise(success => {
            fetch(this.path, this.config)
                .then(function (response) {
                    response.json().then(function (data) {
                        success(data);
                    });
                })
        });

    }

    set(data) {
        this.method = 'POST';
        return new Promise(success => {
            fetch(this.path, Object.assign({ 'body': JSON.stringify(data) }, this.config))
                .then(function (response) {
                    response.json().then(function (data) {
                        success(data);
                    });
                })
        });
    }
}