import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("reservations", (table) => {
        table
        .text("status")
        .notNullable()
        .defaultTo("pending")
        .checkIn(["confirmed", "cancelled", "pending"]);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table("reservations", (table) => {
        table.dropColumn("status");
    });
}

