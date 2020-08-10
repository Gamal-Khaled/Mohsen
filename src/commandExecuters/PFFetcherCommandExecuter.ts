import CommandExecuter from "./CommandExecuter";
import EntityTypes from "models/EntityTypes";
import NamedEntity from "models/NamedEntity";
import AssisstantResponse from "models/AssisstantResponse";
import WikipediaAPIHandler from "apis/WikipediaAPIHandler";

interface Params {
    title: string[];
}

export default class PFFetcherCommandExecuter extends CommandExecuter<Params> {
    extractParamsFromEntities = (entities: NamedEntity[]): Params => {
        const neededEntities = entities.filter(entity =>
            entity.entityType == EntityTypes.PERSON_NAME
        );

        return {
            title: neededEntities.map(entity => entity.word)
        };
    };

    processCommand = async (params: Params): Promise<AssisstantResponse> => {
        if (params.title.length === 0) {
            return {
                commandUnderstood: false,
                userMessage: 'Sorry, who are you asking about?',
                getVoiceInput: true,
                displayChoices: false,
            }
        }

        let wikiResponse;
        try {
            wikiResponse = await WikipediaAPIHandler.getSummary(
                params.title.reduce((titlePart, accumulate) => titlePart + "_" + accumulate)
            )
        } catch (error) {
            if (error == 404) {
                return {
                    commandUnderstood: true,
                    userMessage: "Sorry, couldn't find any information",
                    getVoiceInput: false,
                    displayChoices: false,
                }
            }
        }

        if (wikiResponse.type === "disambiguation") {
            return {
                commandUnderstood: false,
                userMessage: 'Please give me some details.',
                getVoiceInput: true,
                displayChoices: false,
            }
        }

        if (wikiResponse.type !== "standard") {
            return {
                commandUnderstood: true,
                userMessage: 'Something went wrong please try again later.',
                getVoiceInput: false,
                displayChoices: false,
            }
        }

        return {
            commandUnderstood: true,
            userMessage: "According to Wikipedia, " + wikiResponse.extract,
            getVoiceInput: false,
            displayChoices: false,
            thumbnail: wikiResponse.thumbnail.source,
            onClickUrl: wikiResponse.content_urls.mobile.page
        }
    };
}