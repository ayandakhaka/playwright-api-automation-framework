// api/payload/model/PetBuilder.ts
import { Pet } from "../../models/pet.js";
export class PetBuilder {
    constructor() {
        this._id = 0;
        this._name = "";
        this._photoUrls = [];
        this._tags = [];
    }
    // Set ID
    withId(id) {
        this._id = id;
        return this;
    }
    // Set Category
    withCategory(category) {
        this._category = category;
        return this;
    }
    // Set Name
    withName(name) {
        this._name = name;
        return this;
    }
    // Set Photo URLs
    withPhotoUrls(photoUrls) {
        this._photoUrls = photoUrls;
        return this;
    }
    // Add single Photo URL
    addPhotoUrl(url) {
        this._photoUrls.push(url);
        return this;
    }
    // Set Tags
    withTags(tags) {
        this._tags = tags;
        return this;
    }
    // Add single Tag
    addTag(tag) {
        this._tags.push(tag);
        return this;
    }
    // Set Status
    withStatus(status) {
        this._status = status;
        return this;
    }
    // Build the Pet object
    build() {
        return new Pet(this._id, this._category, this._name, this._photoUrls, this._tags, this._status);
    }
}
