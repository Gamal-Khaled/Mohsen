import Intents from "./Intents";
import NamedEntity from "./NamedEntity";

export default interface Prediction {
    intent: Intents;
    entities: NamedEntity[];
}