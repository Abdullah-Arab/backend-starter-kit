import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("transaction_items", (table) => {
    table.increments("id").primary().unique();
    table.integer("transaction_id").unsigned().references("id").inTable("transactions").onDelete("CASCADE");
    table.integer("item_id").unsigned().references("id").inTable("items").onDelete("CASCADE");
    table.integer("quantity").unsigned().notNullable().defaultTo(1);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    
    // Composite unique constraint to prevent duplicate entries
    table.unique(["transaction_id", "item_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("transaction_items");
}
