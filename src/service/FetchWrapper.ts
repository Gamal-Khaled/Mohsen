interface RequestParams {
    [key: string]: any;
}

export default class FetchWrapper {
    baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    get = (endPoint: string, params: RequestParams = {}) => {
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
            })
                .then(response => response.json())
                .then(resolve)
                .catch(reject);
        });
    }

    post = (endPoint: string, data: RequestParams = {}) => {
        return new Promise((resolve, reject) => {
            fetch(this.baseURL + endPoint, {
                method: "POST",
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(resolve)
                .catch(reject);
        });
    }

    put = (endPoint: string, data: RequestParams = {}) => {
        return new Promise((resolve, reject) => {
            fetch(this.baseURL + endPoint, {
                method: "PUT",
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(resolve)
                .catch(reject);
        });
    }

    delete = (endPoint: string, data: RequestParams = {}) => {
        return new Promise((resolve, reject) => {
            fetch(this.baseURL + endPoint, {
                method: "DELETE",
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(resolve)
                .catch(reject);
        });
    }
}