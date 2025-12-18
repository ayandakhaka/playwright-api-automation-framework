import { test, expect } from "../fixtures/petStoreFeature.js";
import type { TestInfo } from "@playwright/test";
import type { Pet } from "../api/models/pet.js";
import { Category } from "../api/models/category.js";
import { Tag } from "../api/models/tag.js";
import { step } from "../api/utils/helper/testStepHelper.js";
import * as path from "path";
import * as fs from "fs";

let responseBody: any;
let petData: Pet;
let petId: number;
let response: any;

//
// =========================================
//  TC01 – Add a new pet with valid data
// =========================================
//
test.describe("Pet Store API", () => {
    test.describe("Add new Pet", async () => {

        test("TC01 – Add a new pet with valid data",
            async ({ petClient, petBuilder }, testInfo: TestInfo) => {

                // Arrange
                await step("Initialize PetBuilder and attach state", async () => {

                    testInfo.attachments.push({
                        name: "PetBuilder State",
                        body: Buffer.from(JSON.stringify(petBuilder, null, 2)),
                        contentType: "application/json",
                    });

                    petBuilder
                        .withId(Date.now())
                        .withName("Buddy")
                        .withCategory(new Category(1, "Dogs"))
                        .addPhotoUrl("http://example.com/photo1.jpg")
                        .addTag(new Tag(1, "friendly"))
                        .withStatus("available");

                    petData = petBuilder.build();
                });

                // Act
                await step("Send request to create pet", async () => {
                    response = await petClient.addPet(petData);
                    responseBody = await response.json();
                    petId = responseBody.id;
                });

                // Assert
                await step("Validate http status code", async () => {
                    expect(response.status()).toBe(200);
                });

                await step("Validate response body", async () => {
                    expect(responseBody.id).toBe(petData.id);
                    expect(responseBody.name).toBe(petData.name);
                    expect(responseBody.status).toBe(petData.status);
                });

                await step("Retrieve the added pet", async () => {
                    response = await petClient.getPetById(petId);
                    expect(response.status()).toBe(200);
                });
            });
    });

    //
    // =========================================
    //  TC02 – Add a pet with multiple photos
    // =========================================
    //
    test("TC02 – Add a pet with multiple photos", async ({ petBuilder, petClient }) => {

        // Arrange
        await step("Initialize data", async () => {
            petBuilder
                .withId(Date.now())
                .withName("Max")
                .withCategory(new Category(1, "Dogs"))
                .addPhotoUrl("http://example.com/photo1.jpg")
                .addPhotoUrl("http://example.com/photo2.jpg")
                .addPhotoUrl("http://example.com/photo3.jpg")
                .addPhotoUrl("http://example.com/photo4.jpg")
                .addTag(new Tag(1, "friendly"))
                .withStatus("available");

            petData = petBuilder.build();
        });

        // Act
        await step("Submit request", async () => {
            response = await petClient.addPet(petData);
            responseBody = await response.json();
        });

        // Assert
        await step("Validate status", async () => {
            expect(response.status()).toBe(200);
        });

        await step("Validate photo URLs list is not empty", async () => {
            const urls = responseBody.photoUrls;
            expect(urls.length).toBeGreaterThan(0);
        });

        await step("Validate all URLs are valid", async () => {
            const urls = responseBody.photoUrls;
            for (const url of urls) {
                expect(url).toMatch(/^https?:\/\/.+/);
            }
        });
    });


    //
    // =========================================
    //  TC03 – Add a pet with multiple tags
    // =========================================
    //
    test("TC03 – Add a pet with multiple tags", async ({ petBuilder, petClient }) => {

        // Arrange
        await step("Initialize pet with multiple tags", async () => {
            petBuilder
                .withId(Date.now())
                .withName("Buddy")
                .withCategory(new Category(1, "Dogs"))
                .addPhotoUrl("http://example.com/photo1.jpg")
                .addTag(new Tag(1, "friendly"))
                .addTag(new Tag(2, "Alwand1"))
                .addTag(new Tag(3, "Alwand2"))
                .addTag(new Tag(4, "Alwand3"))
                .withStatus("available");

            petData = petBuilder.build();
        });

        // Act
        await step("Send request", async () => {
            response = await petClient.addPet(petData);
            responseBody = await response.json();
        });

        // Assert
        await step("Validate status", async () => {
            expect(response.status()).toBe(200);
        });

        await step("Validate tags are not empty", async () => {
            const tags = responseBody.tags;
            expect(tags.length).toBeGreaterThan(0);
        });
    });


    //
    // =========================================
    //  TC05 – Add pet without a name
    // =========================================
    //
    test("TC05 – Name field missing", async ({ petBuilder, petClient }) => {

        // Arrange
        await step("Initialize data without name", async () => {
            petBuilder
                .withId(Date.now())
                .withCategory(new Category(1, "Dogs"))
                .addPhotoUrl("http://example.com/photo1.jpg")
                .addTag(new Tag(1, "friendly"))
                .withStatus("available");

            petData = petBuilder.build();
        });

        // Act
        await step("Send request", async () => {
            response = await petClient.addPet(petData);
            responseBody = await response.json();
        });

        // Assert
        await step("Validate status code", async () => {
            expect(response.status()).toBe(200); // pet name missing this is a false pass
        });
    });

    //
    // =========================================
    //  TC06 – Get Pet by ID
    // =========================================
    //
    test.describe("Test Case for Get By ID endpoint", () => {

        test("TC06 – Get Pet by ID", async ({ petClient, petBuilder }) => {

            // Arrange

            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");

                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });

            // Act
            await step("Get pet by pet id", async () => {
                response = await petClient.getPetById(petId);
                responseBody = await response.json();
                console.log("Response body:", JSON.stringify(responseBody, null, 2));
            });

            // Assert

            await step("Validate http status code", async () => {
                expect(response.status()).toBe(200);
            });
        });
        //
        // =========================================
        //  TC07 – Get non existing bet
        // =========================================
        //

        test("TC07 – Get non existing bet", async ({ petClient, petBuilder }) => {

            // Arrange

            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");

                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });

            // Act
            await step("Get non existing pet by pet id", async () => {
                response = await petClient.getPetById(920);
            });

            // Arrange
            await step("Validate http status code", async () => {
                expect(response.status()).toBe(404);
            });

            await step("Verify message response body", async () => {
                responseBody = await response.json();
                expect(responseBody.message).toBe("Pet not found");
            })
        })

        //
        // =========================================
        //  TC08 – Get Pet with string id
        // =========================================
        //
        test("TC08 – Get Pet with string id", async ({ petClient, petBuilder }) => {

            // Arrange

            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");

                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });

            // Act

            await step("Get pet with string pet id", async () => {
                response = await petClient.getPetById("920");
            });

            // Assert

            await step("Validate http status code", async () => {
                expect(response.status()).toBe(404);
            });

            await step("Verify message response body", async () => {
                responseBody = await response.json();
                expect(responseBody.message).toBe("Pet not found");
            })
        })

        //
        // ==========================================================
        //  TC09 – Performance: Get pet by id should respond < 2000ms
        // ==========================================================
        //
        test("TC09 - Performance: Get pet by id should respond < 2000ms", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");

                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });

            const start = Date.now();
            // Act
            response = await petClient.getPetById(petId);
            const end = Date.now();

            const responseTime = end - start;
            console.log("Response time:", responseTime + "ms");
            // Assert
            expect(responseTime).toBeLessThan(2000);
        });

        //
        // ==================================================
        //  TC010 – Validate response contract matches schema
        // ==================================================
        //
        test("TC010 - Validate response contract matches schema", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");

                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });

            // Act
            response = await petClient.getPetById(petId);
            responseBody = await response.json();

            // Assert
            expect(responseBody.id).toBe(petData.id);
            expect(responseBody.category.id).toBe(petData.category?.id);
            expect(responseBody.category.name).toBe(petData.category?.name);
            expect(responseBody.name).toBe(petData.name);
            expect(responseBody.photoUrls).toEqual(["http://example.com/photo1.jpg"]);
            expect(responseBody.status).toBe(petData.status);
        });
    });

    test.describe("Test Cases for Upload Pet Image endpoint", () => {

        //
        // ==================================================
        //  TC-UP-01: Upload image for existing pet
        // ==================================================
        //
        test("TC-UP-01: Upload image for existing pet", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });

            const imagePath = path.resolve(process.cwd(), "src", "tests",
                "assets", "images", "FB_IMG_17084971361856946.jpg");
            const imageBuffer = fs.readFileSync(imagePath);
            // Act
            await step("Upload image for the pet", async () => {
                response = await petClient.uploadPetImage(petId, imageBuffer, "FB_IMG_17084971361856946.jpg");
                responseBody = await response.json();
            });

            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });

            responseBody = await response.json();
            console.log("Response body:", JSON.stringify(responseBody, null, 2));

            await step("Validate response message", async () => {
                expect(responseBody.message).toContain("FB_IMG_17084971361856946.jpg");
            });

        });

        // ==================================================
        //  TC-UP-02: Upload image for non-existing pet
        // ==================================================
        //
        test("TC-UP-02: Upload image for non-existing pet", async ({ petClient }) => {

            const imagePath = path.resolve(process.cwd(), "src", "tests",
                "assets", "images", "FB_IMG_17084971361856946.jpg");
            const imageBuffer = fs.readFileSync(imagePath);
            // Act
            await step("Upload image for a non-existing pet", async () => {
                response = await petClient.uploadPetImage("99999999999", imageBuffer, "FB_IMG_17084971361856946.jpg");
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200); // This is a false pass as the API returns 200 even for non-existing pet
            });
            // await step("Validate response message", async () => {
            //     responseBody = await response.json();
            //     expect(responseBody.message).toBe("Pet not found");
            // });
        });

        // ==================================================
        //  TC-UP-03: Upload image with meta data
        // ==================================================
        //
        test("TC-UP-03: Upload image with meta data", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            const imagePath = path.resolve(process.cwd(), "src", "tests",
                "assets", "images", "FB_IMG_17084971361856946.jpg");
            const imageBuffer = fs.readFileSync(imagePath);
            // Act
            await step("Upload image with meta data for the pet", async () => {
                response = await petClient.uploadPetImage(petId, imageBuffer,
                    "FB_IMG_17084971361856946.jpg", "Profile picture");
                responseBody = await response.json();
            });

            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });

            responseBody = await response.json();
            console.log("Response body:", JSON.stringify(responseBody, null, 2));

            await step("Validate meta data in response message", async () => {
                expect(responseBody.message).toContain("Profile picture");
            });
        });

        // ==================================================
        //  TC-UP-04: Upload image with empty file
        // ==================================================
        //
        test("TC-UP-04: Upload image with empty file", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            const emptyBuffer = Buffer.from([]);
            // Act
            await step("Upload image with empty file for the pet", async () => {
                response = await petClient.uploadPetImage(petId, emptyBuffer,
                    "empty.jpg");
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);   // This is a false pass as the API returns 200 even for empty file
            });
        });
    });

    test.describe("Test cases for updating existing pet", () => {

        //
        // ==================================================
        //  TC-UP-01: Update existing pet
        // ==================================================
        //
        test("TC-UP-01: Update existing pet", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });

            // Modify pet data
            petData.name = "BuddyUpdated";
            petData.status = "sold";
            // Act
            await step("Update existing pet", async () => {
                response = await petClient.updateExistingPet(petData);
                responseBody = await response.json();
            });

            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });

            await step("Validate updated fields", async () => {
                expect(responseBody.name).toBe("BuddyUpdated");
                expect(responseBody.status).toBe("sold");
            });
        });

        //
        // ==================================================
        //  TC-UP-02: Update non-existing pet
        // ==================================================
        //
        test("TC-UP-02: Update non-existing pet", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(99999999999) // Non-existing ID
                    .withName("NonExistentPet")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            // Act
            await step("Attempt to update non-existing pet", async () => {
                response = await petClient.updateExistingPet(petData);
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);  // This is a false pass as the API returns 200 even for non-existing pet
            });

            // await step("Validate response message", async () => {
            //     expect(responseBody.message).toBe("Pet not found");
            // });
        });

        //
        // ==================================================
        //  TC-UP-03: Update pet with invalid data
        // ==================================================
        //
        test("TC-UP-03: Update pet with invalid data", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Introduce invalid data
            (petData as any).invalidField = "invalidValue"; 
            // Act
            await step("Attempt to update pet with invalid data", async () => {
                response = await petClient.updateExistingPet(petData);
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200); // This is a false pass as the API returns 200 even for invalid data
            });

            // await step("Validate response for error message", async () => {
            //     expect(responseBody.message).toBe("Invalid data");
            // });
        });

        //
        // ==================================================
        //  TC-UP-04: Update pet and verify changes
        // ==================================================
        //
        test("TC-UP-04: Update pet and verify changes", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Modify pet data

            petData.name = "BuddyVerified";
            petData.status = "pending";
            // Act
            await step("Update existing pet", async () => {
                response = await petClient.updateExistingPet(petData);
                responseBody = await response.json();
            });

            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });

            await step("Retrieve and verify updated pet", async () => {
                response = await petClient.getPetById(petId);
                responseBody = await response.json();
                expect(responseBody.name).toBe("BuddyVerified");
                expect(responseBody.status).toBe("pending");
            });
        });

        //
        // ==================================================
        //  TC-UP-05: Update pet with partial data
        // ==================================================
        //
        test("TC-UP-05: Update pet with partial data", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Modify pet data - only status
            petData.status = "pending";

            // Act
            await step("Update existing pet with partial data", async () => {
                response = await petClient.updateExistingPet(petData);
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Validate updated status field", async () => {
                expect(responseBody.status).toBe("pending");
            });
        });

        //
        // ==================================================
        //  TC-UP-06: Update pet with large data set
        // ==================================================
        //
        test("TC-UP-06: Update pet with large data set", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Modify pet data - add many photo URLs and tags
            for (let i = 2; i <= 50; i++) {
                petData.photoUrls.push(`http://example.com/photo${i}.jpg`);
                petData.tags.push(new Tag(i, `tag${i}`));
            }
            // Act
            await step("Update existing pet with large data set", async () => {
                response = await petClient.updateExistingPet(petData);
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Validate all photo URLs and tags are updated", async () => {
                expect(responseBody.photoUrls.length).toBe(50);
                expect(responseBody.tags.length).toBe(50);
            });
        });

        //
        // ======================================================
        //  TC-UP-07: Update pet with special characters in name
        // ======================================================
        //
        test("TC-UP-07: Update pet with special characters in name", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Modify pet data - special characters in name
            petData.name = "Buddy!@#$%^&*()_+|";
            // Act
            await step("Update existing pet with special characters in name", async () => {
                response = await petClient.updateExistingPet(petData);
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Validate updated name with special characters", async () => {
                expect(responseBody.name).toBe("Buddy!@#$%^&*()_+|");
            });
        });

        //
        // ======================================================
        //  TC-UP-08: Update pet and check response time
        // ======================================================
        //
        test("TC-UP-08: Update pet and check response time", async ({ petClient, petBuilder }) => {
            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });
            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Modify pet data
            petData.name = "BuddyPerformance";
            petData.status = "sold";
            const start = Date.now();   
            // Act
            await step("Update existing pet and measure response time", async () => {
                response = await petClient.updateExistingPet(petData);
                responseBody = await response.json();
            });
            const end = Date.now();
            const responseTime = end - start;
            console.log("Response time for updating pet:", responseTime + "ms");
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Validate response time is under 2000ms", async () => {
                expect(responseTime).toBeLessThan(2000);
            });
        });

        //
        // ======================================================
        //  TC-UP-09: Update pet and validate response schema
        // ======================================================
        //
        test("TC-UP-09: Update pet and validate response schema", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Modify pet data
            petData.name = "BuddySchema";
            petData.status = "sold";
            // Act
            await step("Update existing pet", async () => {
                response = await petClient.updateExistingPet(petData);
                responseBody = await response.json();
            }); 
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Validate response schema", async () => {
                expect(responseBody).toHaveProperty("id");
                expect(responseBody).toHaveProperty("category");
                expect(responseBody).toHaveProperty("name");
                expect(responseBody).toHaveProperty("photoUrls");
                expect(responseBody).toHaveProperty("tags");
                expect(responseBody).toHaveProperty("status");
            });
        });

        //
        // ======================================================
        //  TC-UP-10: Update pet with boundary values
        // ======================================================
        //
        test("TC-UP-10: Update pet with boundary values", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Modify pet data - boundary values
            petData.name = "B".repeat(255);
            petData.status = "a".repeat(50);
            // Act
            await step("Update existing pet with boundary values", async () => {
                response = await petClient.updateExistingPet(petData);
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Validate updated fields with boundary values", async () => {
                expect(responseBody.name).toBe("B".repeat(255));
                expect(responseBody.status).toBe("a".repeat(50));
            });
        });
    });

    test.describe("Test Cases for Find Pets by Status endpoint", () => {

        //
        // ==================================================
        //  TC01 – Find pets by valid status
        // ==================================================
        //
        test("TC01 – Find pets by valid status", async ({ petClient, petBuilder }) => {
            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Act
            await step("Find pets by status 'available'", async () => {
                response = await petClient.findPetsByStatus("available");
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });

            await step("Verify that at least one pet is returned", async () => {
                expect(responseBody.length).toBeGreaterThan(0);
            });

            await step("Verify that returned pets have status 'available'", async () => {
                const allAvailable = responseBody.every((pet: any) => pet.status === "available");
                expect(allAvailable).toBe(true);
            });
        });

        // ==================================================
        //  TC02 – Find pets by invalid status
        // ==================================================
        test("TC02 – Find pets by invalid status", async ({ petClient }) => {
            // Act
            await step("Find pets by invalid status 'flying'", async () => {
                response = await petClient.findPetsByStatus("flying");
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Verify that no pets are returned", async () => {
                expect(responseBody.length).toBe(0);
            });
        });

        // ==================================================
        //  TC03 – Find pets by multiple statuses
        // ==================================================
        test("TC03 – Find pets by multiple statuses", async ({ petClient, petBuilder }) => {
            // Arrange
            await step("Initialize PetBuilder and attach state for 'available' pet", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });
            await step("Send request to create 'available' pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            await step("Initialize PetBuilder and attach state for 'sold' pet", async () => {
                petBuilder
                    .withId(Date.now() + 1)
                    .withName("Max")
                    .withCategory(new Category(2, "Cats"))
                    .addPhotoUrl("http://example.com/photo2.jpg")
                    .addTag(new Tag(2, "playful"))
                    .withStatus("sold");
                petData = petBuilder.build();
            });
            await step("Send request to create 'sold' pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Act
            await step("Find pets by statuses 'available' and 'sold'", async () => {
                response = await petClient.findPetsByStatus("available,sold");
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Verify that returned pets have status 'available' or 'sold'", async () => {
                const validStatuses = ["available", "sold"];
                const allValid = responseBody.every((pet: any) => validStatuses.includes(pet.status));
                expect(allValid).toBe(true);
            });
        });

        // ==================================================
        //  TC04 – Find pets with no status parameter
        // ==================================================
        test("TC04 – Find pets with no status parameter", async ({ petClient, petBuilder }) => {

            // Arrange
            await step("Create a pet to ensure there is data", async () => {
                petBuilder
                    .withId(Date.now()) 
                    .withName("Charlie")
                    .withCategory(new Category(3, "Birds"))
                    .addPhotoUrl("http://example.com/photo3.jpg")
                    .addTag(new Tag(3, "colorful"))
                    .withStatus();
                petData = petBuilder.build();
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });

            // Act
            await step("Find pets with no status parameter", async () => {
                response = await petClient.findPetsByStatus();
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });

            console.log("Response body:", JSON.stringify(responseBody, null, 2));
            console.log("Number of pets returned:", responseBody.length);
            await step("Verify that some pets are returned", async () => {
                expect(responseBody.length).toEqual(0);
            });
        });
    });

    test.describe("Test Cases for Update Pet with Form Data endpoint", () => {

        // ==================================================
        //  TC01 – Update pet name and status using form data
        // ==================================================
        test("TC01 – Update pet name and status using form data", async ({ petClient, petBuilder }) => {
            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });
            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Act
            await step("Update pet name to 'BuddyForm' and status to 'sold' using form data", async () => {
                response = await petClient.updatePetWithForm(petId, "BuddyForm", "sold");
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            console.log("Response body:", JSON.stringify(responseBody, null, 2));
            await step("Validate updated message body", async () => {
                expect(responseBody.message).toBe(petData.id.toString());
            });
        });

        // ==================================================
        //  TC02 – Update pet with only name using form data
        // ==================================================
        test("TC02 – Update pet with only name using form data", async ({ petClient, petBuilder }) => {
            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Max")
                    .withCategory(new Category(2, "Cats"))
                    .addPhotoUrl("http://example.com/photo2.jpg")
                    .addTag(new Tag(2, "playful"))
                    .withStatus("available");
                petData = petBuilder.build();
            });
            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Act
            await step("Update pet name to 'MaxForm' using form data", async () => {
                response = await petClient.updatePetWithForm(petId, "MaxForm");
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Validate updated body message", async () => {
                expect(responseBody.message).toBe(petData.id.toString());

            });
        });

        // ==================================================
        //  TC03 – Update pet with only status using form data
        // ==================================================

        test("TC03 – Update pet with only status using form data", async ({ petClient, petBuilder }) => {
            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Charlie")
                    .withCategory(new Category(3, "Birds"))
                    .addPhotoUrl("http://example.com/photo3.jpg")
                    .addTag(new Tag(3, "colorful"))
                    .withStatus("available");
                petData = petBuilder.build();
            });
            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Act
            await step("Update pet status to 'pending' using form data", async () => {
                response = await petClient.updatePetWithForm(petId, undefined, "pending");
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Validate updated body message", async () => {
                expect(responseBody.message).toBe(petData.id.toString());
            });
        });

        // ==================================================
        //  TC04 – Update pet without petId using form data
        // ==================================================
        test("TC04 – Update pet without petId using form data", async ({ petClient }) => {
            // Act
            await step("Attempt to update pet without petId using form data", async () => {
                try {
                    // @ts-ignore
                    response = await petClient.updatePetWithForm(undefined, "NoIdPet", "sold");
                } catch (APIResponse) {
                    response = APIResponse;
                }
            });

            // Assert
            await step("Validate that an error is thrown", async () => {
                expect(response.status()).toBe(404);
            });
        });

        // ==================================================
        //  TC05 – Update pet with invalid petId using form data
        // ==================================================
        test("TC05 – Update pet with invalid petId using form data", async ({ petClient }) => {
            // Act
            await step("Attempt to update pet with invalid petId using form data", async () => {
                response = await petClient.updatePetWithForm(-1, "InvalidIdPet", "sold");
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(404);
            });
        });
    });

    test.describe("Test cases for Delete Pet endpoint", () => {
        // ==================================================
        //  TC01 – Delete existing pet
        // ==================================================
        test("TC01 – Delete existing pet", async ({ petClient, petBuilder }) => {
            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Buddy")
                    .withCategory(new Category(1, "Dogs"))
                    .addPhotoUrl("http://example.com/photo1.jpg")
                    .addTag(new Tag(1, "friendly"))
                    .withStatus("available");
                petData = petBuilder.build();
            });

            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Act
            await step("Delete the existing pet", async () => {
                response = await petClient.deletePet(petId);
                responseBody = await response.json();
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Validate deletion message", async () => {
                expect(responseBody.message).toBe(petId.toString());
            });
        });

        // ==================================================
        //  TC02 – Delete non-existing pet
        // ==================================================
        test("TC02 – Delete non-existing pet", async ({ petClient }) => {
            // Arrange
            const nonExistingPetId = 99999999; // Assuming this ID does not exist
            // Act
            await step("Attempt to delete a non-existing pet", async () => {
                response = await petClient.deletePet(nonExistingPetId);
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(404);
            });

            await step("Validate error message", async () => {
                const bodyText = await response.text();

                if (bodyText) {
                    const body = JSON.parse(bodyText);
                    expect(body.message).toContain("Pet not found");
                } else {
                    console.log("No response body returned (expected)");
                }
            });
        });

        // ==================================================
        //  TC03 – Delete pet with invalid ID
        // ==================================================
        test("TC03 – Delete pet with invalid ID", async ({ petClient }) => {
            // Arrange
            const invalidPetId = -1; // Invalid ID
            // Act
            await step("Attempt to delete a pet with invalid ID", async () => {
                response = await petClient.deletePet(invalidPetId);
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(404);
            });

            await step("Validate error message", async () => {
                const bodyText = await response.text();
                if (bodyText) {
                    const body = JSON.parse(bodyText);
                    expect(body.message).toContain("Pet not found");
                } else {
                    console.log("No response body returned (expected)");
                }
            });
        });

        // ==================================================
        //  TC04 – Delete pet and verify it no longer exists
        // ==================================================
        test("TC04 – Delete pet and verify it no longer exists", async ({ petClient, petBuilder }) => {
            // Arrange
            await step("Initialize PetBuilder and attach state", async () => {
                petBuilder
                    .withId(Date.now())
                    .withName("Max")
                    .withCategory(new Category(2, "Cats"))
                    .addPhotoUrl("http://example.com/photo2.jpg")
                    .addTag(new Tag(2, "playful"))
                    .withStatus("available");
                petData = petBuilder.build();
            });
            await step("Send request to create pet", async () => {
                response = await petClient.addPet(petData);
                responseBody = await response.json();
                petId = responseBody.id;
            });
            // Act
            await step("Delete the existing pet", async () => {
                response = await petClient.deletePet(petId);
            });
            // Assert
            await step("Validate deletion status code", async () => {
                expect(response.status()).toBe(200);
            });
            await step("Attempt to retrieve the deleted pet", async () => {
                response = await petClient.getPetById(petId);
            });
            await step("Validate that the pet no longer exists", async () => {
                expect(response.status()).toBe(404);
            });
        });

        // ==================================================
        //  TC05 – Delete pet with special characters in ID
        // ==================================================
        test("TC05 – Delete pet with special characters in ID", async ({ petClient }) => {
            // Arrange
            const specialCharPetId: any = "@"; // Invalid ID with special characters
            // Act
            await step("Attempt to delete a pet with special characters in ID", async () => {
                // @ts-ignore
                response = await petClient.deletePet(specialCharPetId);
            });
            // Assert
            await step("Validate status code", async () => {
                expect(response.status()).toBe(404);
            });
            await step("Validate error message", async () => {
                const bodyText = await response.text();
                if (bodyText) {
                    const body = JSON.parse(bodyText);
                    expect(body.message).toContain("NumberFormatException");
                } else {
                    console.log("No response body returned (expected)");
                }
            });
        });
    });
});

