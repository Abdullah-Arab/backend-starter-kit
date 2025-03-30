import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary().unique();
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    table.decimal("amount", 10, 2).notNullable();
    table.text("status").notNullable().defaultTo("pending");
    table.date("date").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("transactions");
}
