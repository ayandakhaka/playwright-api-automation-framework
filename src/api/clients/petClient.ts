// Import only the type for APIRequestContext since it's used for type-checking
import type { APIRequestContext } from "@playwright/test";

// Import route constants and utility to build dynamic routes
import { Routes } from '../endpoints/routes.js';
import { buildRoute } from "../utils/builder/routeBuilder.js";

/**
 * PetClient class handles all API interactions related to pets in the Petstore API.
 * Each method corresponds to a specific REST endpoint.
 */
export class PetClient {
  // Inject Playwright's APIRequestContext for making HTTP requests
  constructor(private request: APIRequestContext) { }

  /**
   * Get a pet by its ID
   * @param petId - ID of the pet to fetch
   * @returns API response of GET /pet/{petId}
   */
  async getPetById(petId: number | string) {
    // Build the endpoint URL with the petId
    const route = buildRoute(Routes.get_pet_by_id, { petId });
    return this.request.get(route);
  }

  /**
   * Add a new pet to the store
   * @param petData - Object containing pet details (id, name, status, etc.)
   * @returns API response of POST /pet
   */
  async addPet(petData: object) {
    return this.request.post(Routes.add_pet, {
      data: petData,
    });
  }

  /**
   * Delete a pet by its ID
   * @param petId - ID of the pet to delete
   * @returns API response of DELETE /pet/{petId}
   */
  async deletePet(petId: number) {
    const route = buildRoute(Routes.delete_pet, { petId });
    return this.request.delete(route);
  }

  /**
   * Update an existing pet with full details
   * @param petData - Object containing updated pet details
   * @returns API response of PUT /pet
   */
  async updateExistingPet(petData: object) {
    return this.request.put(Routes.update_existing_pet, {
      data: petData,
    });
  }

  /**
   * Find pets by their status
   * @param status - Pet status to filter by (e.g., "available", "sold")
   * @returns API response of GET /pet/findByStatus
   */
  async findPetsByStatus(status?: string) {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    return this.request.get(Routes.find_pet_by_status, { params });
  }

  /**
   * Update a pet partially using form data
   * @param petId - ID of the pet to update
   * @param name - (Optional) New name for the pet
   * @param status - (Optional) New status for the pet
   * @returns API response of POST /pet/{petId}
   */
  async updatePetWithForm(petId: number, name?: string, status?: string) {
    const route = buildRoute(Routes.update_pet_with_form, { petId });
    const formData: Record<string, string> = {};

    // Only include fields that are provided
    if (name) formData['name'] = name;
    if (status) formData['status'] = status;

    return this.request.post(route, {
      form: formData,
    });
  }

  /**
   * Upload an image for a pet
   * @param petId - ID of the pet
   * @param imageData - Buffer of the image file
   * @param fileName - Name of the image file
   * @returns API response of POST /pet/{petId}/uploadImage
   */
  async uploadPetImage(
    petId: number | string,
    imageData: Buffer,
    fileName: string,
    additionalMetadata?: string
  ) {
    const route = buildRoute(Routes.upload_pet_image, { petId });

    return this.request.post(route, {
      multipart: {
        // ✅ Optional metadata for testing
        ...(additionalMetadata && { additionalMetadata }),

        // ✅ Image file
        file: {
          name: fileName,
          mimeType: this.getMimeType(fileName),
          buffer: imageData,
        },
      },
    });
  }

  private getMimeType(fileName: string): string {
    const ext = (fileName || '').toString().split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'bmp':
        return 'image/bmp';
      case 'webp':
        return 'image/webp';
      case 'svg':
        return 'image/svg+xml';
      default:
        return 'application/octet-stream';
    }
  }
}
