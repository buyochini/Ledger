import {After, Before, Given, Then, When} from '@cucumber/cucumber';
import {Browser, chromium, Page, Response} from 'playwright';
import {expect} from '@playwright/test';
import RegistrationPage from '../pages/RegistrationPage';
import LoginPage from '../pages/LoginPage';
import ContactsPage from '../pages/ContactsPage';
import {Contact} from "./apiSteps";
import {ICustomWorld} from "../support/custom-world";

let browser: Browser;
let page: Page;
let registrationPage: RegistrationPage;
let loginPage: LoginPage;
let contactsPage: ContactsPage;

const user = {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser${Date.now()}@testaccount.com`,
    password: 'password123',
};

export const contact: Contact = {
    firstName: "John",
    lastName: "Williams",
    birthdate: "2021-01-01",
    email: user.email,
    phone: "1234567890",
    street1: "1 Washington street",
    street2: "washington street",
    city: "Greenwich",
    stateProvince: "London",
    postalCode: "12345",
    country: "UK"
};

/**
 * Logs in using the provided credentials, waits for the login response,
 * and extracts the bearer token either from the response headers or cookies.
 */
async function loginAndExtractToken(email: string, password: string): Promise<string | undefined> {
    await loginPage.navigate();
    const [loginResponse] = await Promise.all([
        page.waitForResponse((response: Response) =>
            response.url().includes('/login') && response.status() === 200
        ),
        loginPage.login(email, password)
    ]);

    let token: string | undefined;
    const authHeader = loginResponse.request().headers()['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        console.log('Extracted token from headers:', token);
    } else {
        const cookies = await page.context().cookies();
        const authCookie = cookies.find(cookie => cookie.name === 'token');
        token = authCookie?.value;
        console.log('Extracted token from cookies:', token);
    }
    return token;
}

/**
 * Clicks the "Add Contact" button, creates a contact, waits for the GET /contacts response,
 * and returns the new contact's ID.
 */
async function createContactAndWaitForResponse(contactData: Contact): Promise<string> {
    await contactsPage.clickAddContact();
    const [response] = await Promise.all([
        page.waitForResponse((response: Response) =>
            response.url().includes('/contacts') &&
            response.status() === 200 &&
            response.request().method() === 'GET'
        ),
        contactsPage.createContact(
            contactData.firstName,
            contactData.lastName,
            contactData.birthdate,
            contactData.email,
            contactData.phone,
            contactData.street1,
            contactData.street2,
            contactData.city,
            contactData.stateProvince,
            contactData.postalCode,
            contactData.country
        )
    ]);

    const contactsList = await response.json() as Contact[];
    const contactId = contactsList.find(c => c.email === contactData.email)?._id;
    expect(contactId).toBeDefined();
    return contactId!;
}

Before("@ui", async function () {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
    registrationPage = new RegistrationPage(page);
    loginPage = new LoginPage(page);
    contactsPage = new ContactsPage(page);
});

Given('I navigate to the registration page', async function () {
    await registrationPage.navigate();
});

When('I register a user with valid credentials', async function () {
    await registrationPage.register(user.firstName, user.lastName, user.email, user.password);
});

Given('I log in with the same credentials', async function () {
    await loginPage.navigate();
    await loginPage.login(user.email, user.password);
});

When('I log in with email {string} and password {string}', async function (username: string, password: string) {
    await loginPage.login(username, password);
});

Then('I should see the contact list page', async function () {
    await expect(page).toHaveURL(/.*contactList/);
    await page.waitForSelector('#logout');
});

Given('I am logged in', async function (this: ICustomWorld) {
    this.AuthToken = await loginAndExtractToken("bayomak@gmail.com", "London2025");
});

Given('I am logged in with an existing contact', async function (this: ICustomWorld) {
    this.AuthToken = await loginAndExtractToken("bayomak@gmail.com", "London2025");
    await expect(page).toHaveURL(/.*contactList/);

    // Update the email for uniqueness
    contact.email = `testuser${Date.now()}@testaccount.com`;
    this.ContactId = await createContactAndWaitForResponse(contact);
});

When('I create a new contact with valid data', async function (this: ICustomWorld) {
    this.ContactId = await createContactAndWaitForResponse(contact);
});

Then('I should see the contact in the list', async function () {
    await contactsPage.verifyContactExists(contact.email);
});

Given('I edit the contact\'s email', async function () {
    await contactsPage.selectContactRow(contact.email);
    // Update the email for uniqueness
    contact.email = `testuser${Date.now()}@testaccount.com`;
    await contactsPage.editContact(contact.email);
});

Then('I should see the updated contact in the list', async function () {
    await page.locator(`text=${contact.email}`).waitFor();
});

After("@ui", async function () {
    try {
        if (browser) {
            await browser.close();
        }
    } catch (error) {
        console.error('Error during browser cleanup:', error);
    }
});
