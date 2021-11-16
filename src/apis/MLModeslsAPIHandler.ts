import FetchWrapper from "services/FetchWrapper";
import { baseURL } from "./constants";

class MLModeslsAPIHandler {
    private fetchWrapper = new FetchWrapper(baseURL);

    predictIntent = (sentense: string): Promise<any> => (
        this.fetchWrapper.post(`/predict/intent`, { sentense })
    )

    predictEntities = (sentense: string): Promise<any> => (
        this.fetchWrapper.post(`/predict/entities`, { sentense })
    )
}

export default new MLModeslsAPIHandler();