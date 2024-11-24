import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const projectsTable = pgTable("projects_table", {
  id: serial('id').primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  link: text().notNull(),
  github: text().notNull(),
  authors: text().array().notNull(),
});
