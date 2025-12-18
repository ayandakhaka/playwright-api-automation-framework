// package: api/payload/model/Pet.ts
import { Category } from "../models/category.js";
import { Tag } from "../models/tag.js";

export class Store {
    orderId: number;
    petId: number;
    quantity: number;
    status: string;
    complete: boolean;

    //constructor();

    // ✅ Full constructor
    constructor(
        orderId: number,
        petId: number,
        quantity: number,
        status: string,
        complete: boolean
    );

    constructor(
        orderId: number,
        petId: number,
        quantity: number,
        status: string,
        complete: boolean
    ) {
        this.orderId = orderId ?? 0;
        this.petId = petId ?? 0;
        this.quantity = quantity ?? 0;
        this.status = status ?? "";
        this.complete = complete ?? false;

    }
}