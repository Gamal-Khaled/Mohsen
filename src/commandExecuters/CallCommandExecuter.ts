import CommandExecuter from "./CommandExecuter";
import EntityType from "models/EntityType";
import NamedEntity from "models/NamedEntity";
import ContactsService from "services/ContactsService";
import ExecuterResponse from "models/ExecuterResponse";

interface Params {
    contactName: string[];
}

class CallCommandExecuter extends CommandExecuter<Params> {
    extractParamsFromEntities = (entities: NamedEntity[]) => {
        const neededEntities = entities.filter(entity =>
            entity.entityType === EntityType.Contact_Name
        );

        return {
            contactName: neededEntities.map(entity => entity.word)
        };
    };

    executeCommand = async (params: Params): Promise<ExecuterResponse> => {
        if (params.contactName.length === 0) {
            return {
                commandExecuted: false,
                userMessage: 'Who do you want me to call?',
                getVoiceInput: true,
                displayChoices: false,
            }
        } else {
            const matchingContacts = await ContactsService.searchForContact(params.contactName);
            if (matchingContacts.length === 1) {
                return {
                    commandExecuted: true,
                    userMessage: 'Ok',
                    getVoiceInput: false,
                    displayChoices: false,
                }
            } else {
                return {
                    commandExecuted: false,
                    userMessage: 'Sorry I got confused, which one of those?',
                    getVoiceInput: false,
                    displayChoices: true,
                    choices: matchingContacts.map((contact, i) => ({
                        id: i,
                        value: contact.givenName + contact.familyName,
                    }))
                }
            }
        }
    };
}

export default CallCommandExecuter;