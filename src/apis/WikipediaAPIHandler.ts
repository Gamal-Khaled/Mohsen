import FetchWrapper from "services/FetchWrapper";
import { WikipediaAPIBaseURL } from "./constants";

class WikipediaAPIHandler {
    fetchWrapper = new FetchWrapper(WikipediaAPIBaseURL);

    getSummary = (title: string): Promise<any> => (
        this.fetchWrapper.get(`/page/summary/${title}?redirect=true`)
    )
}

export default new WikipediaAPIHandler();