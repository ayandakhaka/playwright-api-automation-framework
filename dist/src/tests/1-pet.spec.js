import { test, expect } from "../fixtures/petStoreFeature.js";
import { Category } from "../api/models/category.js";
import { Tag } from "../api/models/tag.js";
import { step } from "../api/utils/helper/testStepHelper.js";
let responseBody;
let petData;
let petId;
let response;
test.describe("Pet Store API - Pet Endpoint", () => {
    test.beforeEach(async ({ petBuilder, petClient }, testInfo) => {
        await step("Initialize PetBuilder and attach state to test report", async () => {
            testInfo.attachments.push({
                name: 'PetBuilder State',
                body: Buffer.from(JSON.stringify(petBuilder, null, 2)),
                contentType: 'application/json',
            });
            // Initialize pet data for tests
            petBuilder
                .withId(Date.now())
                .withName("Buddy")
                .withCategory(new Category(1, "Dogs"))
                .addPhotoUrl("http://example.com/photo1.jpg")
                .addTag(new Tag(1, "friendly"))
                .withStatus("available");
            petData = petBuilder.build();
            response = await petClient.addPet(petData);
            expect(response.status()).toBe(200);
            responseBody = await response.json();
            petId = responseBody.id;
        });
    });
    test.describe("Add a new pet", () => {
        test("Verify status code", async ({ petClient, petBuilder }, testInfo) => {
            await step("Add a new pet to the store", async () => {
                expect(responseBody.id).toBe(petData.id);
            });
        });
        test("Verify pet name", async () => {
            await step("Name validation", async () => {
                expect(responseBody.name).toBe(petData.name);
            });
        });
        test("Verify pet id", async () => {
            await step("Pet Id validation", async () => {
                expect(responseBody.id).toBe(petData.id);
            });
        });
        test("Verify pet status", async () => {
            await step("Status validation", async () => {
                expect(responseBody.status).toBe(petData.status);
            });
        });
    });
    test.describe("Get pet by Id", () => {
        test("Verify 200 OK status code", async ({ petClient }) => {
            await step("Get pet by pet id", async () => {
                console.log("Pet Id : " + petId);
                response = await petClient.getPetById(petId);
                // Print JSON response body
                responseBody = await response.json();
                console.log("Response body:", JSON.stringify(responseBody, null, 2));
            });
            await step("Validate http status code", async () => {
                expect(response.status()).toBe(200);
            });
        });
        test("Verify 404 not found for non existing pet id", async ({ petClient }) => {
            await step("Get non existing pet by pet id", async () => {
                response = await petClient.getPetById(920);
            });
            await step("Validate http status code", async () => {
                expect(response.status()).toBe(404);
            });
            await step("Verify message response body", async () => {
                responseBody = await response.json();
                expect(responseBody.message).toBe("Pet not found");
            });
        });
        test("Verify 404 not found for get pet with string id", async ({ petClient }) => {
            await step("Get pet with string pet id", async () => {
                response = await petClient.getPetById("920");
            });
            await step("Validate http status code", async () => {
                expect(response.status()).toBe(404);
            });
            await step("Verify message response body", async () => {
                responseBody = await response.json();
                expect(responseBody.message).toBe("Pet not found");
            });
        });
        test("Performance: Get pet by id should respond < 2000ms", async ({ petClient }) => {
            const start = Date.now();
            response = await petClient.getPetById(petId);
            const end = Date.now();
            const responseTime = end - start;
            console.log("Response time:", responseTime + "ms");
            expect(responseTime).toBeLessThan(2000);
        });
        test("Validate response contract matches schema", async ({ petClient }) => {
            response = await petClient.getPetById(petId);
            responseBody = await response.json();
            expect(responseBody.id).toBe(petData.id);
            expect(responseBody.category.id).toBe(petData.category?.id);
            expect(responseBody.category.name).toBe(petData.category?.name);
            expect(responseBody.name).toBe(petData.name);
            expect(responseBody.photoUrls).toEqual(["http://example.com/photo1.jpg"]);
            expect(responseBody.status).toBe(petData.status);
        });
    });
});
