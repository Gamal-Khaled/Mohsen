import FetchWrapper from "services/FetchWrapper";
import { baseURL } from "./constants";

class MLModeslsAPIHandler {
    fetchWrapper = new FetchWrapper(baseURL);

    predictIntent = (text: string): Promise<any> => (
        this.fetchWrapper.get(`/predict/intent`, { text })
    )

    predictEntities = (text: string): Promise<any> => (
        this.fetchWrapper.get(`/predict/ner`, { text })
    )
}

export default new MLModeslsAPIHandler();