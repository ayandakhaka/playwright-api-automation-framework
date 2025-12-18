// api/payload/model/PetBuilder.ts
import { Pet } from "../../models/pet.js";
import { Category } from "../../models/category.js";
import { Tag } from "../../models/tag.js";

export class PetBuilder {
  private _id: number = 0;
  private _category?: Category;
  private _name: string = "";
  private _photoUrls: string[] = [];
  private _tags: Tag[] = [];
  private _status?: string;

  // Set ID
  withId(id: number): PetBuilder {
    this._id = id;
    return this;
  }

  // Set Category
  withCategory(category: Category): PetBuilder {
    this._category = category;
    return this;
  }

  // Set Name
  withName(name?: string): PetBuilder {
    this._name = name;
    return this;
  }

  // Set Photo URLs
  withPhotoUrls(photoUrls: string[]): PetBuilder {
    this._photoUrls = photoUrls;
    return this;
  }

  // Add single Photo URL
  addPhotoUrl(url: string): PetBuilder {
    this._photoUrls.push(url);
    return this;
  }

  // Set Tags
  withTags(tags: Tag[]): PetBuilder {
    this._tags = tags;
    return this;
  }

  // Add single Tag
  addTag(tag: Tag): PetBuilder {
    this._tags.push(tag);
    return this;
  }

  // Set Status
  withStatus(status?: string): PetBuilder {
    this._status = status;
    return this;
  }

  // Build the Pet object
  build(): Pet {
    return new Pet(
      this._id,
      this._category!,
      this._name,
      this._photoUrls,
      this._tags,
      this._status!
    );
  }
}
