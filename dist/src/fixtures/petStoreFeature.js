import { test as base } from '@playwright/test';
import { PetClient } from '../api/clients/petClient.js';
import { PetBuilder } from '../api/utils/builder/petBuilder.js';
export const test = base.extend({
    petClient: async ({ request }, use) => {
        const client = new PetClient(request);
        await use(client);
    },
    petBuilder: async ({}, use) => {
        const builder = new PetBuilder();
        await use(builder);
    }
});
export { expect } from '@playwright/test';
