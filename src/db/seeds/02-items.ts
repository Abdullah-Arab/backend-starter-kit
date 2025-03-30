import { Knex } from "knex";
import { faker } from "@faker-js/faker";

const createFakeItem = () => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
});

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("items").del();

  const fakeItems = [];
  const desiredFakeItems = 20;
  for (let i = 0; i < desiredFakeItems; i++) {
    fakeItems.push(createFakeItem());
  }

  // Inserts seed entries
  await knex("items").insert(fakeItems);
}
