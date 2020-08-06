import CommandExecuter from './CommandExecuter';
import NamedEntity from 'models/NamedEntity';
import EntityTypes from 'models/EntityTypes';
import MapboxAPIHandler from 'apis/MapboxAPIHandler';
import AssisstantResponse from 'models/AssisstantResponse';

interface Params {
    location: string[];
    chosenLocation?: string[];
}

export default class MapsSearchCommandExecuter extends CommandExecuter<Params> {
    private choices: any[] = [];

    extractParamsFromEntities = (entities: NamedEntity[]): Params => {
        const neededEntities = entities.filter(entity =>
            entity.entityType == EntityTypes.LOCATION ||
            entity.entityType == EntityTypes.LOCATION_TYPE
        );

        return {
            location: neededEntities.map(entity => entity.word)
        };
    };

    processCommand = async (params: Params): Promise<AssisstantResponse> => {
        if (params.chosenLocation) {
            const locationName = params.chosenLocation.reduce((locationPart, accumulate) => locationPart + " " + accumulate);
            const choosenLocation = this.choices.find(location => location.place_name === locationName);

            return {
                commandUnderstood: true,
                displayChoices: false,
                getVoiceInput: false,
                userMessage: "Here you go.",
                mapData: {
                    lat: choosenLocation.center[0],
                    lng: choosenLocation.center[1],
                }
            }
        }

        if (params.location.length === 0) {
            return {
                commandUnderstood: false,
                userMessage: 'What is the place that you are looking for?',
                getVoiceInput: true,
                displayChoices: false,
            }
        }

        const mapsAPIResponse = await MapboxAPIHandler.forwardGeocoding(
            params.location.reduce((locationPart, accumulate) => locationPart + " " + accumulate)
        );

        if (!mapsAPIResponse.features.length) {
            return {
                commandUnderstood: false,
                userMessage: 'Sorry, What is the place that you are looking for again?',
                getVoiceInput: true,
                displayChoices: false,
            }
        }

        if (mapsAPIResponse.features.length === 1) {
            return {
                commandUnderstood: true,
                displayChoices: false,
                getVoiceInput: false,
                userMessage: "Here you go.",
                mapData: {
                    lat: mapsAPIResponse.features[0].center[0],
                    lng: mapsAPIResponse.features[0].center[1],
                }
            }
        }

        this.choices = mapsAPIResponse.features;
        return {
            commandUnderstood: false,
            userMessage: "I found some results, Which one do you want?",
            getVoiceInput: false,
            displayChoices: true,
            choices: mapsAPIResponse.features.map((feature: any, i: number) => ({
                id: i,
                value: feature.place_name,
                paramName: 'chosenLocation'
            }))
        }
    }
}