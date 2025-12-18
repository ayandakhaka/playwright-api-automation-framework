/**
 * Routes class contains all the endpoint URLs for
 * User, Pet, and Store modules in the Swagger Petstore API.
 *
 * These constants are used inside API client files
 * (e.g., petClient.ts, userClient.ts, storeClient.ts)
 * to make HTTP requests using Playwright.
 */
var _a;
export class Routes {
}
_a = Routes;
// -------------------- Base URL --------------------
Routes.base_url = "https://petstore.swagger.io/v2";
// -------------------- User Endpoints --------------------
Routes.create_users_with_list = `${_a.base_url}/user/createWithList`;
Routes.create_users_with_array = `${_a.base_url}/user/createWithArray`;
Routes.create_user = `${_a.base_url}/user`;
Routes.get_user_by_username = `${_a.base_url}/user/{username}`;
Routes.login_user = `${_a.base_url}/user/login`;
Routes.logout_user = `${_a.base_url}/user/logout`;
Routes.update_user = `${_a.base_url}/user/{username}`;
Routes.delete_user = `${_a.base_url}/user/{username}`;
// -------------------- Pet Endpoints --------------------
Routes.add_pet = `${_a.base_url}/pet`;
Routes.upload_pet_image = `${_a.base_url}/pet/{petId}/uploadImage`;
Routes.update_existing_pet = `${_a.base_url}/pet`;
Routes.find_pet_by_status = `${_a.base_url}/pet/findByStatus`;
Routes.get_pet_by_id = `${_a.base_url}/pet/{petId}`;
Routes.update_pet_with_form = `${_a.base_url}/pet/{petId}`;
Routes.delete_pet = `${_a.base_url}/pet/{petId}`;
// -------------------- Store Endpoints --------------------
Routes.place_order = `${_a.base_url}/store/order`;
Routes.get_order_by_id = `${_a.base_url}/store/order/{orderId}`;
Routes.get_inventory = `${_a.base_url}/store/inventory`;
Routes.delete_order = `${_a.base_url}/store/order/{orderId}`;
