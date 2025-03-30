import { Knex } from "knex";
import { faker } from "@faker-js/faker";

const createFakeUser = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
});

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  const fakeUsers = [];
  const desiredFakeUsers = 10;
  for (let i = 0; i < desiredFakeUsers; i++) {
    fakeUsers.push(createFakeUser());
  }

  // Inserts seed entries
  await knex("users").insert(fakeUsers);
}
