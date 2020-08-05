import { Choice } from "./AssisstantResponse";

export default interface ChatMessage {
    userMessage: boolean;
    msg: string;
    thumbnail?: string;
    onClickUrl?: string;
}