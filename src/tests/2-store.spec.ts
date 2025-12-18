import { test, expect } from "../fixtures/petStoreFeature.js";
import type { TestInfo } from "@playwright/test";
import type { Pet } from "../api/models/pet.js";
import { step } from "../api/utils/helper/testStepHelper.js";
import { error } from "node:console";

let responseBody: any;
let response: any;
let storeData: any;
let id: number;
let orderId: number;

test.describe("Store API - Place Order", () => {

    test.describe("Positive Tests", () => {

        test("Place an order for a pet - Positive Case", async ({ storeBuilder, storeClient, petBuilder, petClient }, testInfo: TestInfo) => {
            // Create a new pet to order


            // Arrange
            await step("Create a new pet to order", async () => {
                storeBuilder
                    .withPetId(Math.floor(Math.random() * 100000))
                    .withQuantity(1)
                    .withStatus("placed")
                    .withIsComplete(false);
                storeData = storeBuilder.build();

                // Act
                response = await storeClient.placeOrder(storeData);

                // Assert
                expect(response.status()).toBe(200);
                responseBody = await response.json();
            });

            id = responseBody.id;

            console.log("Response body:", JSON.stringify(responseBody, null, 2));

            await step("Validate the order response", async () => {
                expect(responseBody.id).toBe(id);
                expect(responseBody.petId).toBe(storeData.petId);
                expect(responseBody.quantity).toBe(storeData.quantity);
                expect(responseBody.status).toBe(storeData.status);
                expect(responseBody.complete).toBe(storeData.complete);
            });
        });

        test("TC-PO-02: Place order with different valid status values", async ({ storeBuilder, storeClient }, testInfo: TestInfo) => {
            const validStatuses = ["placed", "approved", "delivered"];
            for (const status of validStatuses) {
                await step(`Place order with status: ${status}`, async () => {
                    // Arrange
                    storeBuilder
                        .withPetId(Math.floor(Math.random() * 100000))
                        .withQuantity(2)
                        .withStatus(status as "placed" | "approved" | "delivered")
                        .withIsComplete(true);
                    storeData = storeBuilder.build();
                    // Act
                    response = await storeClient.placeOrder(storeData);
                    // Assert
                    expect(response.status()).toBe(200);
                    responseBody = await response.json();
                    expect(responseBody.status).toBe(status);
                });
            }
        });

        test("TC-PO-03: Place order with quantity > 1", async ({ storeBuilder, storeClient }, testInfo: TestInfo) => {
            await step("Place order with quantity of 5", async () => {
                // Arrange
                storeBuilder
                    .withPetId(Math.floor(Math.random() * 100000))
                    .withQuantity(5)
                    .withStatus("approved")
                    .withIsComplete(true);
                storeData = storeBuilder.build();
                // Act
                response = await storeClient.placeOrder(storeData);
                // Assert
                expect(response.status()).toBe(200);
                responseBody = await response.json();
                expect(responseBody.quantity).toBe(5);
            });
        });

        test("TC-PO-04: Place order with complete = false", async ({ storeBuilder, storeClient }, testInfo: TestInfo) => {
            await step("Place order with complete set to false", async () => {
                // Arrange
                storeBuilder
                    .withPetId(Math.floor(Math.random() * 100000))
                    .withQuantity(1)
                    .withStatus("placed")
                    .withIsComplete(false);
                storeData = storeBuilder.build();
                // Act
                response = await storeClient.placeOrder(storeData);
                // Assert
                expect(response.status()).toBe(200);
                responseBody = await response.json();
                expect(responseBody.complete).toBe(false);
            });
        });

    });

    test.describe("Negative Tests", () => {

        test("TC-PO-05: Place order with missing petId", async ({ storeBuilder, storeClient }, testInfo: TestInfo) => {
            await step("Attempt to place order without petId", async () => {
                // Arrange
                storeBuilder
                    .withQuantity(1)
                    .withStatus("placed")
                    .withIsComplete(true);
                storeData = storeBuilder.build();
                // Act 

                response = await storeClient.placeOrder(storeData);
                console.log("Response body:", JSON.stringify(responseBody, null, 2));


                // Assert
                expect(response.status()).toBe(200); // This is a false passe as the API currently allows this
            });
        });

        test("TC-PO-06: API allows quantity = 0 (known behavior)", async ({ storeBuilder, storeClient }) => {
            storeBuilder
                .withPetId(Math.floor(Math.random() * 100000))
                .withQuantity(0)
                .withStatus("approved")
                .withIsComplete(true);
            storeData = storeBuilder.build();

            const response = await storeClient.placeOrder(storeData);
            expect(response.status()).toBe(200); // Documented API flaw
        });

        test("TC-PO-07: Place order with negative quantity", async ({ storeBuilder, storeClient }, testInfo: TestInfo) => {
            await step("Attempt to place order with negative quantity", async () => {
                // Arrange
                storeBuilder
                    .withPetId(Math.floor(Math.random() * 100000))
                    .withQuantity(-3)
                    .withStatus("placed")
                    .withIsComplete(true);
                storeData = storeBuilder.build();
                // Act
                response = await storeClient.placeOrder(storeData);
                responseBody = await response.json();
                console.log("Response body:", JSON.stringify(responseBody, null, 2));
                // Assert
                expect(response.status()).toBe(200); // This is a false passe as the API currently allows this
            });
        });

        test("TC-PO-09: Place order with invalid petId type", async ({ storeBuilder, storeClient }, testInfo: TestInfo) => {
            await step("Attempt to place order with string petId", async () => {
                // Arrange
                storeBuilder
                    .withPetId("invalid_id" as unknown as number)
                    .withQuantity(1)
                    .withStatus("placed")   
                    .withIsComplete(true);
                storeData = storeBuilder.build();
                // Act
                response = await storeClient.placeOrder(storeData);
                responseBody = await response.json();
                console.log("Response body:", JSON.stringify(responseBody, null, 2));
                // Assert
                expect(response.status()).toBe(500); // This is a false passe as the API currently allows this
            });
        });

    });

});

test.describe("Store API - Get Order by ID", () => {

    test.describe("Positive Tests", () => {

        test("Get order by ID - Positive Case", async ({ storeBuilder, storeClient }, testInfo: TestInfo) => {
            // Arrange & Act: First, place a new order to retrieve later
            await step("Place a new order to retrieve later", async () => {
                storeBuilder
                    .withPetId((Date.now() % 900) + 1) // Ensure petId is between 1 and 900
                    .withQuantity(1)
                    .withStatus("placed")
                    .withIsComplete(false);
                storeData = storeBuilder.build();
                response = await storeClient.placeOrder(storeData);
                expect(response.status()).toBe(200);
                responseBody = await response.json();
                orderId = responseBody.id;
            });

            //Act & Assert:

            // Now, retrieve the order by ID
            await step("Retrieve the order by ID", async () => {
                const getResponse = await storeClient.getOrderById(storeData.petId);
                console.log("Body of placed order:", JSON.stringify(responseBody, null, 2));

                expect(getResponse.status()).toBe(200);
            });
        });

        test("TC-GOI-03: Get order using numeric string orderId", async ({ storeBuilder, storeClient }, testInfo: TestInfo) => {
            // Arrange & Act: First, place a new order to retrieve later
            await step("Place a new order to retrieve later", async () => {

                storeBuilder
                    .withPetId((Date.now() % 900) + 1) // Ensure petId is between 1 and 900
                    .withQuantity(2)
                    .withStatus("approved")
                    .withIsComplete(true);
                storeData = storeBuilder.build();
                response = await storeClient.placeOrder(storeData);
                expect(response.status()).toBe(200);
                responseBody = await response.json();
                orderId = storeData.petId.toString();
            });

            //Act & Assert:
            await step("Retrieve the order using numeric string orderId", async () => {
                const getResponse = await storeClient.getOrderById(orderId);
                expect(getResponse.status()).toBe(404); // Known API behavior: returns 404 for string type orderId
            });
        });


    });


    test.describe("Negative Tests", () => {

        test("TC-GOI-04: Get order with non-existing orderId", async ({ storeClient }, testInfo: TestInfo) => {
            await step("Attempt to get order with non-existing orderId", async () => {
                // Arrange
                const nonExistingOrderId = 999999999;
                // Act
                const getResponse = await storeClient.getOrderById(nonExistingOrderId);
                // Assert
                console.log("Body of get response:", JSON.stringify(await getResponse.json(), null, 2));
                expect(getResponse.status()).toBe(404);
                expect((await getResponse.json()).message).toBe("Order not found");
            });
        });

        test("TC-GOI-05: Get order with invalid orderId (alphabets)", async ({ storeClient }, testInfo: TestInfo) => {
            await step("Attempt to get order with invalid orderId (alphabets)", async () => {
                // Arrange
                const invalidOrderId = "invalid_id";
                // Act
                const getResponse = await storeClient.getOrderById(invalidOrderId);
                // Assert
                console.log("Body of get response:", JSON.stringify(await getResponse.json(), null, 2));
                expect(getResponse.status()).toBe(404);
            });

        });

        test("TC-GOI-06: Get order with special characters in orderId", async ({ storeClient }, testInfo: TestInfo) => {
            await step("Attempt to get order with special characters in orderId", async () => {
                // Arrange
                const invalidOrderId = "@#$%";
                // Act
                const getResponse = await storeClient.getOrderById(invalidOrderId);
                // Assert
                console.log("Body of get response:", JSON.stringify(await getResponse.json(), null, 2));
                expect(getResponse.status()).toBe(404);
            });
        });

        test("TC-GOI-07: Get order with empty orderId", async ({ storeClient }, testInfo: TestInfo) => {
            await step("Attempt to get order with empty orderId", async () => {
                // Arrange
                const emptyOrderId = "";
                // Act & Assert
                response = await storeClient.getOrderById(emptyOrderId);
            });

            await step("Validate error response code for empty orderId", async () => {
                expect(response.status()).toBe(405);
            });
        });
    });
});


test.describe("Store API - Get Inventory", () => {
    test.describe("Positive Tests", () => {
    });

    test.describe("Negative Tests", () => {
    });
});

test.describe("Store API - Delete Order", () => {
    test.describe("Positive Tests", () => {
    });

    test.describe("Negative Tests", () => {
    });
});


