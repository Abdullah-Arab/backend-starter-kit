import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("items", (table) => {
    table.increments("id").primary().unique();
    table.text("name").notNullable();
    table.text("description").nullable();
    table.decimal("price", 10, 2).nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("items");
}
