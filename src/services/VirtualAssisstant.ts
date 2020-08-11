import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import MLModeslsAPIHandler from "apis/MLModeslsAPIHandler";
import AssisstantResponse, { Choice } from "models/AssisstantResponse";
import CallCommandExecuter from "commandExecuters/CallCommandExecuter";
import BackendResponsesParser from "utils/BackendResponsesParser";
import Intents from "models/Intents";
import PFFetcherCommandExecuter from "commandExecuters/PFFetcherCommandExecuter";
import MapsSearchCommandExecuter from "commandExecuters/MapsSearchCommandExecuter";

interface AssistantState {
    intent?: Intents;
    params: { [key: string]: any };
    followUpCounter: number;
    displayedChoices?: Choice[];
}

const initialState = {
    params: {},
    followUpCounter: 1,
}

class VirtualAssisstant {
    private state: AssistantState = { ...initialState }

    private supportedCommands = {
        [Intents.CALL]: new CallCommandExecuter(),
        [Intents.PUBLIC_FIGURE]: new PFFetcherCommandExecuter(),
        [Intents.MAP]: new MapsSearchCommandExecuter(),
    }

    private makeIntentPrediction = async (text: string) => {
        try {
            const response = await MLModeslsAPIHandler.predictIntent(text);
            return response.result;
        } catch (e) {
            return { error: true, errorMessage: e };
        }
    }

    private makeEntitiesPrediction = async (text: string) => {
        try {
            const response = await MLModeslsAPIHandler.predictEntities(text);
            return response.result;
        } catch (e) {
            return { error: true, errorMessage: e };
        }
    }

    processUserInput = async (input: string): Promise<AssisstantResponse> => {
        const results = [
            await this.makeIntentPrediction(input),
            await this.makeEntitiesPrediction(input),
        ];

        let error = false;
        results.forEach(res => error = error || !!res.error);

        if (error) {
            return {
                commandUnderstood: true,
                displayChoices: false,
                getVoiceInput: false,
                userMessage: "Something went wrong please try again later."
            }
        }

        if (results[0] === "UNKNOWN") {
            const userId = auth().currentUser?.uid || "ANONYMOUS";
            database().ref(`users/${userId}/unknownCommands`).push({
                intent: results[0],
                entities: results[1],
                input,
            })

            return {
                commandUnderstood: true,
                displayChoices: false,
                getVoiceInput: false,
                userMessage: "Sorry I couldn't understand that."
            }
        }

        const prediction = BackendResponsesParser.parsePrediction(results);
        if (this.supportedCommands[prediction.intent]) {
            const commandExecuter = this.supportedCommands[prediction.intent];
            const extractedParams = commandExecuter.extractParamsFromEntities(prediction.entities);
            const commandProcessingResponse = await commandExecuter.processCommand(extractedParams as any);

            if (commandProcessingResponse.commandUnderstood) {
                const userId = auth().currentUser?.uid || "ANONYMOUS";
                database().ref(`users/${userId}/understoodCommands`).push({
                    intent: prediction.intent,
                    params: extractedParams,
                    numberOfTakes: 1,
                })

                this.state = { ...initialState };
            } else {
                this.state.followUpCounter = 1;
                this.state.params = extractedParams;
                this.state.intent = prediction.intent;
                this.state.displayedChoices = commandProcessingResponse.choices;
            }

            return commandProcessingResponse;
        } else {
            return {
                commandUnderstood: true,
                displayChoices: false,
                getVoiceInput: false,
                userMessage: "Sorry I can't do this.",
            }
        }
    }

    followUpOnCommand = async (input: string): Promise<AssisstantResponse> => {
        if (!this.state.intent) {
            throw new Error("There is no pending command to follow up on");
        }

        const newEntities = await this.makeEntitiesPrediction(input);
        if (newEntities.error) {
            this.state = { ...initialState };
            return {
                commandUnderstood: true,
                displayChoices: false,
                getVoiceInput: false,
                userMessage: "Something went wrong please try again later."
            }
        }

        const prediction = BackendResponsesParser.parsePrediction([this.state.intent, newEntities]);
        const commandExecuter = this.supportedCommands[prediction.intent];

        this.state.params = {
            ...this.state.params,
            ...commandExecuter.extractParamsFromEntities(prediction.entities)
        }

        const commandProcessingResponse = await commandExecuter.processCommand(this.state.params as any);

        if (commandProcessingResponse.commandUnderstood) {
            const userId = auth().currentUser?.uid || "ANONYMOUS";
            database().ref(`users/${userId}/understoodCommands`).push({
                intent: prediction.intent,
                params: this.state.params,
                numberOfTakes: this.state.followUpCounter,
            })

            this.state = { ...initialState };
            return commandProcessingResponse;
        } else {
            this.state.followUpCounter++;
            if (this.state.followUpCounter === 3) {
                const userId = auth().currentUser?.uid || "ANONYMOUS";
                database().ref(`users/${userId}/commandsThatTookTooLong`).push({
                    intent: prediction.intent,
                    params: this.state.params,
                    numberOfTakes: 3,
                })

                this.state = { ...initialState };
                return {
                    commandUnderstood: true,
                    displayChoices: false,
                    getVoiceInput: false,
                    userMessage: "Sorry I didn't get you.",
                }
            } else {
                this.state.displayedChoices = commandProcessingResponse.choices;
                return commandProcessingResponse;
            }
        }
    }

    followUpOnCommandByUserChoice = async (selectedChoice: Choice) => {
        if (!this.state.intent) {
            throw new Error("There is no pending command to follow up on");
        }

        this.state.params[selectedChoice.paramName] = selectedChoice.value.split(" ");
        const commandExecuter = this.supportedCommands[this.state.intent];
        const commandProcessingResponse = await commandExecuter.processCommand(this.state.params as any);

        if (commandProcessingResponse.commandUnderstood) {
            const userId = auth().currentUser?.uid || "ANONYMOUS";
            database().ref(`users/${userId}/understoodCommands`).push({
                intent: this.state.intent,
                params: this.state.params,
                numberOfTakes: this.state.followUpCounter,
            })

            this.state = { ...initialState };
            return commandProcessingResponse;
        } else {
            this.state.followUpCounter++;
            if (this.state.followUpCounter === 3) {
                const userId = auth().currentUser?.uid || "ANONYMOUS";
                database().ref(`users/${userId}/commandsThatTookTooLong`).push({
                    intent: this.state.intent,
                    params: this.state.params,
                    numberOfTakes: 3,
                })

                this.state = { ...initialState };
                return {
                    commandUnderstood: true,
                    displayChoices: false,
                    getVoiceInput: false,
                    userMessage: "Sorry I didn't get it.",
                }
            } else {
                this.state.displayedChoices = commandProcessingResponse.choices;
                return commandProcessingResponse;
            }
        }
    }
}

export default new VirtualAssisstant();