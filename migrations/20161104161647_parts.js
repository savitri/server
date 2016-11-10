const PARTS = "parts";

exports.up = function (knex, Promise) {

    return knex.schema.createTable(PARTS, table => {

        table.increments();
        table.integer("no").notNullable();
        table.integer("edition_id").notNullable();
        table.string("heading").notNullable();
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTable(PARTS);
};
