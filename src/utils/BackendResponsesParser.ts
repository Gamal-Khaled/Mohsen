import Prediction from "models/Prediction";

class BackendResponsesParser {
    parsePrediction = (predictions: any): Prediction => {
        return {
            intent: predictions[0].toUpperCase(),
            entities: predictions[1].map((entity: any) => ({
                word: entity[0],
                entityType: entity[1].toUpperCase()
            }))
        }
    }
}

export default new BackendResponsesParser();