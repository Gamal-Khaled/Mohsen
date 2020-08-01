import CommandExecuter from "./CommandExecuter";
import EntityTypes from "models/EntityTypes";
import NamedEntity from "models/NamedEntity";
import ContactsService from "services/ContactsService";
import AssisstantResponse from "models/AssisstantResponse";
import CallsService from "services/CallsService";

interface Params {
    contactName: string[];
}

export default class CallCommandExecuter extends CommandExecuter<Params> {
    constructor() {
        super();
        ContactsService.initialize();
    }

    extractParamsFromEntities = (entities: NamedEntity[]) => {
        const neededEntities = entities.filter(entity =>
            entity.entityType == EntityTypes.CONTACT_NAME
        );

        return {
            contactName: neededEntities.map(entity => entity.word)
        };
    };

    processCommand = async (params: Params): Promise<AssisstantResponse> => {
        if (params.contactName.length === 0) {
            return {
                commandUnderstood: false,
                userMessage: 'Who do you want to call?',
                getVoiceInput: true,
                displayChoices: false,
            }
        } else if (
            params.contactName.length === 1 &&
            !isNaN(parseInt(params.contactName[0]))
        ) {
            return {
                commandUnderstood: true,
                userMessage: 'Ok',
                getVoiceInput: false,
                displayChoices: false,
                execute: () => CallsService.makePhoneCall(params.contactName[0])
            }
        } else {
            const matchingContacts = await ContactsService.searchForContact(params.contactName);
            console.log(matchingContacts)
            if (matchingContacts.length === 0) {
                return {
                    commandUnderstood: false,
                    userMessage: 'Who do you want to call?',
                    getVoiceInput: true,
                    displayChoices: false,
                }
            } else if (matchingContacts.length === 1) {
                return {
                    commandUnderstood: true,
                    userMessage: 'Ok',
                    getVoiceInput: false,
                    displayChoices: false,
                    execute: () => CallsService.makePhoneCall(matchingContacts[0].phoneNumbers[0].number)
                }
            } else {
                return {
                    commandUnderstood: false,
                    userMessage: 'Sorry, I got confused, which one of those?',
                    getVoiceInput: false,
                    displayChoices: true,
                    choices: matchingContacts.map((contact, i) => ({
                        id: i,
                        value: `${contact.givenName} ${contact.familyName}`,
                        paramName: 'contactName',
                    }))
                }
            }
        }
    };
}