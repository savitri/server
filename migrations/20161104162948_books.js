const BOOKS = "books";

exports.up = function (knex, Promise) {

    return knex.schema.createTable(BOOKS, table => {

        table.increments();
        table.integer("no").notNullable();
        table.integer("edition_id").notNullable();
        table.integer("part_id").notNullable();
        table.string("heading").notNullable();
        table.string("title").notNullable();
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTable(BOOKS);
};
