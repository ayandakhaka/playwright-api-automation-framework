/**
 * Routes class contains all the endpoint URLs for
 * User, Pet, and Store modules in the Swagger Petstore API.
 *
 * These constants are used inside API client files
 * (e.g., petClient.ts, userClient.ts, storeClient.ts)
 * to make HTTP requests using Playwright.
 */

export class Routes {
  // -------------------- Base URL --------------------
  static readonly base_url = "https://petstore.swagger.io/v2";

  // -------------------- User Endpoints --------------------
  static readonly create_users_with_list = `${this.base_url}/user/createWithList`;
  static readonly create_users_with_array = `${this.base_url}/user/createWithArray`;
  static readonly create_user = `${this.base_url}/user`;
  static readonly get_user_by_username = `${this.base_url}/user/{username}`;
  static readonly login_user = `${this.base_url}/user/login`;
  static readonly logout_user = `${this.base_url}/user/logout`;
  static readonly update_user = `${this.base_url}/user/{username}`;
  static readonly delete_user = `${this.base_url}/user/{username}`;

  // -------------------- Pet Endpoints --------------------
  static readonly add_pet = `${this.base_url}/pet`;
  static readonly upload_pet_image = `${this.base_url}/pet/{petId}/uploadImage`;
  static readonly update_existing_pet = `${this.base_url}/pet`;
  static readonly find_pet_by_status = `${this.base_url}/pet/findByStatus`;
  static readonly get_pet_by_id = `${this.base_url}/pet/{petId}`;
  static readonly update_pet_with_form = `${this.base_url}/pet/{petId}`;
  static readonly delete_pet = `${this.base_url}/pet/{petId}`;

  // -------------------- Store Endpoints --------------------
  static readonly place_order = `${this.base_url}/store/order`;
  static readonly get_order_by_id = `${this.base_url}/store/order/{orderId}`;
  static readonly get_inventory = `${this.base_url}/store/inventory`;
  static readonly delete_order = `${this.base_url}/store/order/{orderId}`;
}
