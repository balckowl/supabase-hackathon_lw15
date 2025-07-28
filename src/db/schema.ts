import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export type PhotoItem = {
  url: string;
  title: string;
  description?: string;
  display_order: number;
};

const defaultPhotos = [{
  url: "https://mnbsdhcuplkrmvfnxsze.supabase.co/storage/v1/object/public/photos//1753674779070-1",
  title: "Starlit Station",
  description: "A quiet rural platform bathed in starry night.",
  display_order: 1
}, {
  url: "https://mnbsdhcuplkrmvfnxsze.supabase.co/storage/v1/object/public/photos//1753675319978-1",
  title: "Midnight Takeoff",
  description: "Under a canopy of stars, an airplane ascends from the dimly lit runway into the night sky.",
  display_order: 2
}]

export const studios = pgTable("studios", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").notNull().references(() => authUsers.id, {
    onDelete: "cascade"
  }),
  studioName: text("studio_name").notNull().unique(),
  photos: jsonb("photos").$type<PhotoItem[]>().notNull().default(defaultPhotos),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
})

export const studiosRelations = relations(studios, ({ one }) => ({
  owner: one(authUsers, {
    fields: [studios.ownerId],
    references: [authUsers.id],
  }),
}));
