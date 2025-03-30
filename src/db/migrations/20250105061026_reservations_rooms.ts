import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("reservations_rooms", (table) => {
    table.increments("id").primary().unique();
    table
      .integer("reservation_id")
      .notNullable()
      .references("id")
      .inTable("reservations")
      .onDelete("CASCADE");
    table
      .integer("room_id")
      .notNullable()
      .references("id")
      .inTable("rooms")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTableIfExists("reservations_rooms");
}
