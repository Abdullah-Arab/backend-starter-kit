import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("id").primary().unique();
    table
      .integer("guest_id")
      .notNullable()
      .references("id")
      .inTable("guests")
      .onDelete("CASCADE");
    table.timestamp("check_in").notNullable();
    table.timestamp("check_out").notNullable();
    // table
    //   .text("status")
    //   .notNullable()
    //   .defaultTo("pending")
    //   .checkIn(["confirmed", "cancelled", "pending"]);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTableIfExists("reservations");
}
