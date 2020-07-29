import { PermissionsAndroid } from "react-native";
import Contacts, { Contact } from 'react-native-contacts';

import { getContactFullname } from "utils/ContactsUtils";

class ContactsService {
    private contacts?: Contact[];

    initialize = async () => {
        await this.requestPermissions();
        this.contacts = await this.getAllContacts();
        console.log(this.contacts);
    }

    requestPermissions = async () => {
        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
    }

    private getAllContacts = async (): Promise<Contact[]> => {
        return new Promise((resolve, reject) => {
            Contacts.getAll((error, contacts) => {
                if (error === 'denied') {
                    reject(error);
                } else {
                    resolve(contacts);
                }
            })
        })
    }

    private searchForContactsByFullName = (contactName: string): Contact[] => {
        let tbr: Contact[] = [];
        
        this.contacts?.forEach(contact => {
            if (getContactFullname(contact).toLowerCase() == contactName.toLowerCase()) {
                tbr.push(contact);
            }
        });

        return tbr;
    }

    private searchForContactsByFirstName = (contactName: string): Contact[] => {
        let tbr: Contact[] = [];
        
        this.contacts?.forEach(contact => {
            if (contact.givenName.toLowerCase().includes(contactName.toLowerCase())) {
                tbr.push(contact);
            }
        });

        return tbr;
    }

    searchForContact = async (contactName: string[]): Promise<Contact[] | null> => {
        const fullName = contactName.reduce((namePart, accumulate) => namePart + " " + accumulate);

        const contactBasedOnFullname = this.searchForContactsByFullName(fullName);
        if (contactBasedOnFullname.length) {
            return contactBasedOnFullname;
        } else {
            let contactsBasedOnNamePart: Contact[] = [];
            contactName.forEach(namePart => contactsBasedOnNamePart.push(...this.searchForContactsByFirstName(namePart)));

            return contactsBasedOnNamePart;
        }
    }
}

export default new ContactsService();