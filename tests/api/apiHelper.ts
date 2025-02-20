import {APIRequestContext, expect} from '@playwright/test';
import {Contact} from "../steps/apiSteps";

const API_PATHS = {
    login: '/users/login',
    contacts: '/contacts',
};

export class ApiHelper {
    constructor(private request: APIRequestContext) {
    }

    async login(email: string, password: string): Promise<string> {
        const response = await this.request.post(API_PATHS.login, {
            data: {email, password},
        });
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toEqual(200);
        return (await response.json()).token;
    }

    async createContact(token: string, contact: Contact): Promise<string> {
        const response = await this.request.post(API_PATHS.contacts, {
            headers: {Authorization: `Bearer ${token}`},
            data: contact,
        });
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toEqual(201);
        return (await response.json())._id;
    }

    async getContact(token: string, contactId?: string) {
        const response = await this.request.get(`${API_PATHS.contacts}${contactId ? "/" + contactId : ""}`, {
            headers: {Authorization: `Bearer ${token}`},
        });
        expect(response.ok()).toBeTruthy();
        return response.json();
    }

    async deleteContact(token: string, contactId: string) {
        const response = await this.request.delete(`${API_PATHS.contacts}/${contactId}`, {
            headers: {Authorization: `Bearer ${token}`},
        });
        expect(response.ok()).toBeTruthy();
    }
}
