// package: api/payload/model/Pet.ts
import { Category } from "../models/category.js";
import { Tag } from "../models/tag.js";

export class Pet {
  id: number;
  category?: Category | undefined; // optional if not always provided
  name: string;
  photoUrls: string[];
  tags?: Tag[] | undefined; // optional
  status?: string | undefined; // optional

  // ✅ Default constructor
  constructor();

  // ✅ Full constructor
  constructor(
    id: number,
    category: Category,
    name: string,
    photoUrls: string[],
    tags: Tag[],
    status: string
  );

  constructor(
    id?: number,
    category?: Category,
    name?: string,
    photoUrls?: string[],
    tags?: Tag[],
    status?: string
  ) {
    this.id = id ?? 0;
    this.category = category ?? undefined;
    this.name = name ?? "";
    this.photoUrls = photoUrls ?? [];
    this.tags = tags ?? undefined;
    this.status = status ?? undefined;
  }
}
