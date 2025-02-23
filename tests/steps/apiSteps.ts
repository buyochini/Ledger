import {Given, When, Then, Before, After} from '@cucumber/cucumber';
import {request, APIRequestContext} from 'playwright';
import {expect} from '@playwright/test';
import {ApiHelper} from "../api/apiHelper";
import {contact as baseContact} from "./uiSteps"; // Renamed to baseContact for clarity
import {ICustomWorld} from "../support/custom-world";

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
let api: ApiHelper;

// Setup API context and helper before scenarios with @api or @delete_contact
Before("@api or @delete_contact", async function () {
    apiContext = await request.newContext({baseURL: BASE_URL});
    api = new ApiHelper(apiContext);
});

When('I have valid user credentials', async function () {
});

When('I authenticate via the API', async function (this: ICustomWorld) {
    this.AuthToken = await api.login("bayomak@gmail.com", "London2025");
    expect(this.AuthToken, 'Auth token should be defined').toBeDefined();
});

Then('I should receive a valid token', function (this: ICustomWorld) {
    expect(this.AuthToken, 'Auth token should be truthy').toBeTruthy();
});

When('I create a new contact via the API', async function (this: ICustomWorld) {
    this.ContactId = await api.createContact(this.AuthToken!, baseContact);
    expect(this.ContactId, 'Contact ID should be defined after creation').toBeDefined();
});

Then('I should be able to retrieve the contact', async function (this: ICustomWorld) {
    const retrievedContact = (await api.getContact(this.AuthToken!, this.ContactId)) as Contact;
    expect(retrievedContact.email, `Expected contact email to be ${baseContact.email}`).toBe(baseContact.email);
});

Given('I have a contact created via API', async function (this: ICustomWorld) {
    // Define unique details for the contact
    const firstName = "Fred";
    const lastName = "Flintstone";
    const phone = "08012345678";
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

    // Retrieve all contacts
    const contacts = (await api.getContact(this.AuthToken!)) as Contact[];
    const existingContact = contacts.find((c) =>
        c.firstName === firstName && c.lastName === lastName && c.phone === phone
    );

    if (!existingContact) {
        // Create a new contact using baseContact as a template, overriding specific fields
        this.ContactId = await api.createContact(this.AuthToken!, {
            ...baseContact,
            firstName,
            lastName,
            phone,
            email,
        });
    } else {
        this.ContactId = existingContact._id;
    }
});

When('I delete the contact via the API', async function (this: ICustomWorld) {
    await api.deleteContact(this.AuthToken!, this.ContactId!);
});

Then('The contact should no longer exist', async function (this: ICustomWorld) {
    const contacts = (await api.getContact(this.AuthToken!)) as Contact[];
    const found = contacts.find((c) => c._id === this.ContactId);
    expect(found, 'Contact should be deleted').toBeUndefined();
});

// Cleanup: Ensure that any contact created is removed
After("@delete_contact", async function (this: ICustomWorld) {
    if (this.ContactId) {
        await api.deleteContact(this.AuthToken!, this.ContactId);
    }
});
