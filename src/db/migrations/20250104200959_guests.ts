import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("guests", (table) => {
    table.increments("id").primary().unique();
    table.text("name").notNullable().unique();
    table.text("phone").notNullable().unique();
    table.text("email").notNullable().unique();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTableIfExists("guests");
}
