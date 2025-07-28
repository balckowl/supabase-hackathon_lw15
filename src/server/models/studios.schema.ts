import { studios } from "@/db/schema"
import { createInsertSchema } from "drizzle-zod"
import { z } from "@hono/zod-openapi"


const studiosInsertSchema = createInsertSchema(studios)
export const studioNameInputSchema = studiosInsertSchema
  .pick({ studioName: true })
  .extend({
    studioName: z.string()
      .min(2, { message: "Must be at least 2 characters" })
      .max(10, { message: "Must be at most 10 characters" })
      .regex(/^[a-z]+$/, { message: "Only lowercase letters are allowed" }),
  });

export const photoMetadataSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100, { message: "Must be at most 100 characters" }),
  description: z.string().optional(),
  display_order: z.number().int().min(0, { message: "Must be ≥ 0" }),
});

export const studioPhotosInputSchema = z.object({
  // ── files: 単体／配列／FileList → 常に File[] に変換
  files: z.preprocess((raw) => {
    if (raw == null) return [];
    // FileList の場合
    if (typeof FileList !== 'undefined' && raw instanceof FileList) {
      return Array.from(raw as FileList);
    }
    // 既に配列の場合
    if (Array.isArray(raw)) {
      return raw;
    }
    // 単一 File の場合も配列に包む
    return [raw];
  },
  z
    .array(z.instanceof(File), { invalid_type_error: "You must upload 1–5 images" })
    .min(1, { message: "At least one file is required" })
    .max(5, { message: "Up to five files allowed" })
  ),

  // ── metadata: 文字列(JSON) → 配列に parse してバリデーション
  metadata: z.preprocess((raw) => {
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        return [];
      }
    }
    return raw;
  },
  z
    .array(photoMetadataSchema, { invalid_type_error: "Metadata must match files" })
    .min(1, { message: "At least one metadata item is required" })
    .max(5, { message: "Up to five metadata items allowed" })
  ),
});

export const photoSchema = photoMetadataSchema.extend({
  url: z.string().url()
})
export const studioPhotosOutputSchema = z.array(photoSchema)

export const studioOutputSchema = z.object({
  photos: studioPhotosOutputSchema,
  studioName: z.string(),
  isEditable: z.boolean(),
  ownerIconUrl: z.string().url().nullable()
})


export type StudioNameInputSchemaType = z.infer<typeof studioNameInputSchema>
export type photoSchemaType = z.infer<typeof photoSchema>
export type StudioOutputSchema = z.infer<typeof studioOutputSchema>
