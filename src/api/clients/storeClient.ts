import type { APIRequestContext } from "@playwright/test";
import { Routes } from "../endpoints/routes.js";
import { buildRoute } from "../utils/builder/routeBuilder.js";
import { Store } from "../models/store.js";

/**
 * StoreClient handles all Store API interactions
 */
export class StoreClient {
    constructor(private request: APIRequestContext) {}

    async placeOrder(storeData: Store) {
        return this.request.post(Routes.place_order, {
            headers: {
                "Content-Type": "application/json",
            },
            data: storeData,
        });
    }

    /**
     * Get an order by its ID
     */
    async getOrderById(orderId?: number | string) {
        if (!orderId) {
            throw new Error("orderId must be provided");
        }

        const route = buildRoute(Routes.get_order_by_id, { orderId });
        return this.request.get(route);
    }

        /**
     * Delete an order by its ID
     * @param orderId - ID of the order to delete
     * @returns API response of DELETE /store/order/{orderId}
     */
    async deleteOrder(orderId: number | string) {
        if (!orderId) {
            throw new Error("orderId must be provided");
        }

        const route = buildRoute(Routes.delete_order, { orderId });
        return this.request.delete(route);
    }

}
