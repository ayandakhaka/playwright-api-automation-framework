export class Pet {
    constructor(id, category, name, photoUrls, tags, status) {
        this.id = id ?? 0;
        this.category = category ?? undefined;
        this.name = name ?? "";
        this.photoUrls = photoUrls ?? [];
        this.tags = tags ?? undefined;
        this.status = status ?? undefined;
    }
}
