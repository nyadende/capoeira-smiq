import { bigserial, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const pendingSmiqSubmissions = pgTable("pending_smiq_submissions", {
  id:              bigserial("id", { mode: "number" }).primaryKey(),
  createdAt:       timestamp("created_at", { withTimezone: true }).defaultNow(),
  expiresAt:       timestamp("expires_at", { withTimezone: true }).notNull(),
  token:           text("token").notNull().unique(),
  name:            text("name").notNull(),
  email:           text("email").notNull(),
  segment:         text("segment").notNull(),
  segmentLabel:    text("segment_label").notNull(),
  smiqAnswer:      text("smiq_answer").notNull(),
  teachingRole:    text("teaching_role"),
  graduationLevel: text("graduation_level"),
});

export const smiqResponses = pgTable("smiq_responses", {
  id:              bigserial("id", { mode: "number" }).primaryKey(),
  createdAt:       timestamp("created_at", { withTimezone: true }).defaultNow(),
  name:            text("name"),
  email:           text("email"),
  segment:         text("segment"),
  segmentLabel:    text("segment_label"),
  smiqAnswer:      text("smiq_answer"),
  teachingRole:    text("teaching_role"),
  graduationLevel: text("graduation_level"),
});

export type SmiqResponse = typeof smiqResponses.$inferSelect;
export type NewSmiqResponse = typeof smiqResponses.$inferInsert;
