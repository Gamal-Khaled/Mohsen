interface Params {
    [key: string]: any;
}

const commotDefaultHeaders = {
    "Content-Type": "application/json"
}

export default class FetchWrapper {
    baseURL: string;
    defaultHeaders: Params;

    constructor(baseURL: string, defaultHeader: Params = commotDefaultHeaders) {
        this.baseURL = baseURL;
        this.defaultHeaders = defaultHeader;
    }

    get = (endPoint: string, params: Params = {}) => {
        return new Promise((resolve, reject) => {
            let paramsString = "";
            if (Object.keys(params).length) {
                if (this.baseURL.includes("?")) {
                    Object.keys(params).forEach(key => paramsString += `&${key}=${params[key]}`);
                } else {
                    paramsString = "?";
                    Object.keys(params).forEach(key => paramsString += `${key}=${params[key]}&`);
                }
            }

            fetch(this.baseURL + endPoint + paramsString, {
                method: "GET",
                headers: this.defaultHeaders
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw response.status;
                    }
                })
                .then(resolve)
                .catch(reject);
        });
    }

    post = (endPoint: string, data: Params = {}) => {
        return new Promise((resolve, reject) => {
            fetch(this.baseURL + endPoint, {
                method: "POST",
                body: JSON.stringify(data),
                headers: this.defaultHeaders
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw response.status;
                    }
                })
                .then(resolve)
                .catch(reject);
        });
    }

    put = (endPoint: string, data: Params = {}) => {
        return new Promise((resolve, reject) => {
            fetch(this.baseURL + endPoint, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: this.defaultHeaders
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw response.status;
                    }
                })
                .then(resolve)
                .catch(reject);
        });
    }

    delete = (endPoint: string, data: Params = {}) => {
        return new Promise((resolve, reject) => {
            fetch(this.baseURL + endPoint, {
                method: "DELETE",
                body: JSON.stringify(data),
                headers: this.defaultHeaders
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw response.status;
                    }
                })
                .then(resolve)
                .catch(reject);
        });
    }
}
