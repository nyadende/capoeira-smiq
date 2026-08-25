import { bigserial, pgTable, text, timestamp } from "drizzle-orm/pg-core";

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
  lang:            text("lang"),
});

export type SmiqResponse = typeof smiqResponses.$inferSelect;
export type NewSmiqResponse = typeof smiqResponses.$inferInsert;
