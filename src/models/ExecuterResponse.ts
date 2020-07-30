export interface Choice {
    id: number;
    value: string;
}

export default interface ExecuterResponse {
    commandExecuted: boolean;
    userMessage: string;
    getVoiceInput: boolean;
    displayChoices: boolean;
    choices?: Choice[];
}
