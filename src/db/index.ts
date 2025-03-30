import Knex from "knex";
import config from "../../knexfile";
import { updateTypes } from "knex-types";

const db = Knex(config);


export default db;
