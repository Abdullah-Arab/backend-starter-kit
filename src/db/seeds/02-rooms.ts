import { Knex } from "knex";
import { faker } from "@faker-js/faker";

const createFakeRoom = () => ({
  room_number: faker.number.int({
    max: 999,
    min: 101,
  }),
  name: faker.word.noun(5),
  capacity: faker.number.int({
    max: 10,
    min: 1,
  }),
});

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("rooms").del();

  const fakeRooms = [];
  const desiredFakeRooms = 30;
  for (let i = 0; i < desiredFakeRooms; i++) {
    fakeRooms.push(createFakeRoom());
  }

  // Inserts seed entries
  await knex("rooms").insert(fakeRooms);
}
