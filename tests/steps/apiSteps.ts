import {Given, When, Then, Before, After} from '@cucumber/cucumber';
import {request, APIRequestContext} from 'playwright';
import {expect} from '@playwright/test';
import {ApiHelper} from "../api/apiHelper";
import {contact} from "./uiSteps";

export interface Contact {
    _id?: string;
    firstName: string;
    lastName: string;
    birthdate: string;
    email: string;
    phone: string;
    street1: string;
    street2: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
}

// Constants for base URL and API paths
const BASE_URL = 'https://thinking-tester-contact-list.herokuapp.com';

let apiContext: APIRequestContext;
let authToken: string;
let createdContactId: string;
let api: ApiHelper;

Before("@api", async function () {
    apiContext = await request.newContext({baseURL: BASE_URL});
    api = new ApiHelper(apiContext);
});

When('I have valid user credentials', async function () {
});

When('I authenticate via the API', async function () {
    authToken = await api.login("bayomak@gmail.com", "London2025");
    expect(authToken).toBeDefined();
});

Then('I should receive a valid token', function () {
    expect(authToken).toBeTruthy();
});

When('I create a new contact via the API', async function () {
    createdContactId = await api.createContact(authToken, contact);
    expect(createdContactId).toBeDefined();
});

Then('I should be able to retrieve the contact', async function () {
    const contact = await api.getContact(authToken, createdContactId);
    expect(contact.email).toBe(contact.email);
});

Given('I have a contact created via API', async function () {
    // Check if the contact already exists before creating it
    const firstName = "Fred";
    const lastName = "Flintstone";
    const phone = "08012345678";

    const contacts = await api.getContact(authToken);
    const existingContact = contacts.find((contact: Contact) => contact.firstName === firstName && contact.lastName === lastName && contact.phone === phone);

    if (!existingContact) {
        createdContactId = await api.createContact(authToken, {
            ...contact,
            firstName,
            lastName,
            phone,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`
        });
    } else {
        createdContactId = existingContact._id;
    }
});

When('I delete the contact via the API', async function () {
    await api.deleteContact(authToken, createdContactId);
});

Then('The contact should no longer exist', async function () {
    const contacts = await api.getContact(authToken);
    const found = contacts.find((contact: Contact) => contact._id === createdContactId);
    expect(found).toBeUndefined();
});

After("@delete_contact", async function () {
    if (createdContactId) {
        await api.deleteContact(authToken, createdContactId);
    }
});
