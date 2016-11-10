const CANTOS = "cantos";

exports.up = function (knex, Promise) {

    return knex.schema.createTable(CANTOS, table => {

        table.increments();
        table.integer("no").notNullable();
        table.integer("book_id").notNullable();
        table.string("heading").notNullable();
        table.string("title").notNullable();
        table.string("desc");
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTable(CANTOS);
};
