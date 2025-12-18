// api/payload/builder/StoreBuilder.ts
import { Store } from "../../models/store.js";

export type OrderStatus = "placed" | "approved" | "delivered";

export class StoreBuilder {

    private _orderId: number = Date.now();
    private _petId: number = 1;
    private _quantity: number = 1;
    private _status: OrderStatus = "placed";
    private _complete: boolean = true;

    withId(orderId: number): StoreBuilder {
        this._orderId = orderId;
        return this;
    }

    withPetId(petId: number): StoreBuilder {
        this._petId = petId;
        return this;
    }

    withQuantity(quantity: number): StoreBuilder {
        this._quantity = quantity;
        return this;
    }

    withStatus(status: OrderStatus): StoreBuilder {
        this._status = status;
        return this;
    }

    withIsComplete(isComplete: boolean): StoreBuilder {
        this._complete = isComplete;
        return this;
    }

    reset(): StoreBuilder {
        this._orderId = Date.now();
        this._petId = 1;
        this._quantity = 1;
        this._status = "placed";
        this._complete = true;
        return this;
    }

    build(): Store {
        return new Store(
            this._orderId,
            this._petId,
            this._quantity,
            this._status,
            this._complete
        );
    }
}
