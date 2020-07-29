import { Contact } from "react-native-contacts";

export const getContactFullname = (contact: Contact) => (
    contact.givenName + " " + contact.familyName
)