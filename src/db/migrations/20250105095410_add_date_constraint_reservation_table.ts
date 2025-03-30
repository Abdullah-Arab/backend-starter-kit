import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("reservations", (table) => {
    table.check(
      "check_out > check_in",
      ["check_out", "check_in"],
      "check_date"
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("reservations", (table) => {
    table.dropChecks("check_date");
  });
}
