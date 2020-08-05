import CommandResponse from "./CommandResponse";

export interface Choice {
    id: number;
    value: string;
    paramName: string;
}

export default interface AssisstantResponse {
    commandUnderstood: boolean;
    userMessage: string;
    getVoiceInput: boolean;
    displayChoices: boolean;
    choices?: Choice[];
    execute?: () => Promise<CommandResponse>;
    thumbnail?: string;
    onClickUrl?: string;
}
