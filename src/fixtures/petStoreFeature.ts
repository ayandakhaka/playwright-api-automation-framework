import { test as base } from '@playwright/test';
import { PetClient } from '../api/clients/petClient.js';
import type { Pet } from '../api/models/pet.js';
import { PetBuilder } from '../api/utils/builder/petBuilder.js';
import { StoreClient } from '../api/clients/storeClient.js';
import { StoreBuilder } from '../api/utils/builder/storeBuilder.js';
import { Store } from '../api/models/store.js';

export const test = base.extend<{
    petClient: PetClient;
    petBuilder: PetBuilder;
    petData: Pet;
    storeClient: StoreClient;
    storeBuilder: StoreBuilder;
    storeData: Store;
}>({
    petClient: async ({ request }, use) => {
        const client = new PetClient(request);
        await use(client);
    },

    storeClient: async ({ request }, use) => {
        const client = new StoreClient(request);
        await use(client);
    },


    petBuilder: async ({}, use) => {
        const builder = new  PetBuilder();
        await use(builder);
    },

    storeBuilder: async ({}, use) => {
        const builder = new  StoreBuilder();
        await use(builder);
    }
});

export { expect } from '@playwright/test';


