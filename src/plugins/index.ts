import Knex = require("knex");

export interface ServerPlugins {
    knex: { pg: Knex };
}
