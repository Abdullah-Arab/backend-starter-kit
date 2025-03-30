import { Knex } from "knex";
import { faker } from "@faker-js/faker";

const createFakeGuest = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
});

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("guests").del();

  const fakeGuests = [];
  const desiredFakeGuests = 100;
  for (let i = 0; i < desiredFakeGuests; i++) {
    fakeGuests.push(createFakeGuest());
  }

  // Inserts seed entries
  await knex("guests").insert(fakeGuests);
}
