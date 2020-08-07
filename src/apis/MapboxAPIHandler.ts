import FetchWrapper from "services/FetchWrapper";
import { MapboxAPIBaseURL, MapboxAccessToken } from "./constants";

class WikipediaAPIHandler {
    private fetchWrapper = new FetchWrapper(MapboxAPIBaseURL);

    forwardGeocoding = (title: string): Promise<any> => (
        this.fetchWrapper.get(`/geocoding/v5/mapbox.places/${title}.json?access_token=${MapboxAccessToken}`)
    )
}

export default new WikipediaAPIHandler();