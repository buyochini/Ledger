import { APIRequestContext, expect } from '@playwright/test';
import { Contact } from "../steps/apiSteps";

const API_PATHS = {
    login: '/users/login',
    contacts: '/contacts',
};

export class ApiHelper {
    constructor(private request: APIRequestContext) {}

    // Helper to build URL endpoints consistently
    private buildUrl(path: string, id?: string): string {
        return id ? `${path}/${id}` : path;
    }

    async login(email: string, password: string): Promise<string> {
        try {
            const response = await this.request.post(API_PATHS.login, {
                data: { email, password },
            });
            expect(response.ok()).toBeTruthy();
            expect(response.status()).toEqual(200);

            const jsonResponse = await response.json();
            expect(jsonResponse.token).toBeDefined();
            return jsonResponse.token;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    async createContact(token: string, contact: Contact): Promise<string> {
        try {
            const response = await this.request.post(API_PATHS.contacts, {
                headers: { Authorization: `Bearer ${token}` },
                data: contact,
            });
            expect(response.ok()).toBeTruthy();
            expect(response.status()).toEqual(201);

            const jsonResponse = await response.json();
            expect(jsonResponse._id).toBeDefined();
            return jsonResponse._id;
        } catch (error) {
            console.error('Error creating contact:', error);
            throw error;
        }
    }

    async getContact(token: string, contactId?: string): Promise<Contact | Contact[]> {
        try {
            const url = this.buildUrl(API_PATHS.contacts, contactId);
            const response = await this.request.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            expect(response.ok()).toBeTruthy();
            return await response.json();
        } catch (error) {
            console.error('Error retrieving contact:', error);
            throw error;
        }
    }

    async deleteContact(token: string, contactId: string): Promise<void> {
        try {
            const url = this.buildUrl(API_PATHS.contacts, contactId);
            const response = await this.request.delete(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            expect(response.ok()).toBeTruthy();
        } catch (error) {
            console.error('Error deleting contact:', error);
            throw error;
        }
    }
}
