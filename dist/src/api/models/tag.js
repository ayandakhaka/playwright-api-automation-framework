// api/payload/model/Tag.ts
export class Tag {
    constructor(id, name) {
        this.id = id ?? 0;
        this.name = name ?? "";
    }
}
