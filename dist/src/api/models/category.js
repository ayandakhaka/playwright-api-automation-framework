// api/payload/model/Category.ts
export class Category {
    constructor(id, name) {
        this.id = id ?? 0;
        this.name = name ?? "";
    }
}
