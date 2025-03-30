import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("rooms", (table) => {
    table.increments("id").primary().unique();
    table.integer("room_number").notNullable().unique();
    table.text("name");
    table.integer("capacity").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTableIfExists("rooms");
}
