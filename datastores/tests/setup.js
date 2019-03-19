import {getAppApis, getTemplateApi, setupDatastore} from "budibase-core";
import {action} from "./helpers";

const addField = templateApi => type => (record, name) => {
    const field = templateApi.getNewField(type);
    field.name = name;
    field.type = type;
    field.label = name;
    templateApi.addField(
        record,
        field);
}

export default async (datastore) => {

    datastore = setupDatastore(datastore);
    const templateApi = await getTemplateApi(datastore);
    const addStringField = addField(templateApi)("string");
    const addDateField = addField(templateApi)("datetime");
    const addBoolField = addField(templateApi)("bool");

    const root = templateApi.getNewRootLevel();

    const clients = templateApi.getNewCollectionTemplate(root);
    clients.name = "clients";
    
    const client = templateApi.getNewRecordTemplate(clients);
    client.name = "client"
    addStringField(client, "FamilyName");
    addStringField(client, "Address1");
    addStringField(client, "Address2");
    addStringField(client, "Address3");
    addStringField(client, "Address4");
    addStringField(client, "Postcode");
    addDateField(client, "CreatedDate");

    const children = templateApi.getNewCollectionTemplate(client);
    children.name = "children";
    
    const child = templateApi.getNewRecordTemplate(children);
    child.name = "child";
    addStringField(child, "FirstName");
    addStringField(child, "Surname");
    addDateField(child, "DateOfBirth");
    addBoolField(child, "Current");

    const contacts = templateApi.getNewCollectionTemplate(client);
    contacts.name = "contacts";
    
    const contact = templateApi.getNewRecordTemplate(contacts);
    contact.name = "contact";
    addStringField(contact, "Name");
    addStringField(contact, "relationship");
    addStringField(contact, "phone1");
    addStringField(contact, "phone2");
    addBoolField(contact, "active");

    await templateApi.saveApplicationHeirarchy(root);

    const apis = await getAppApis(datastore);

    await apis.collectionApi.initialiseAll();

    return apis;

}




