import MapboxGL from '@react-native-mapbox-gl/maps';

import CommandExecuter from './CommandExecuter';
import NamedEntity from 'models/NamedEntity';
import EntityTypes from 'models/EntityTypes';
import MapboxAPIHandler from 'apis/MapboxAPIHandler';
import AssisstantResponse from 'models/AssisstantResponse';
import { MapboxAccessToken } from 'apis/constants';

interface Params {
    location: string[];
    chosenLocation?: string[];
}

export default class MapsSearchCommandExecuter extends CommandExecuter<Params> {
    private choices: any[] = [];

    constructor() {
        super();
        MapboxGL.setAccessToken(MapboxAccessToken);
    }

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
                mapData: choosenLocation.center,
                onClickUrl: `geo:${choosenLocation.center[1]},${choosenLocation.center[0]}`
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
                mapData: mapsAPIResponse.features[0].center,
                onClickUrl: `geo:${mapsAPIResponse.feature[0].center[1]},${mapsAPIResponse.feature[0].center[0]}`
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