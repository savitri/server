const EDITIONS = "editions";

exports.up = function (knex, Promise) {

    return knex.schema.createTable(EDITIONS, table => {

        table.increments();
        table.string("title").notNullable();
        table.string("desc");
        table.integer("year").notNullable();
        table.json("toc").notNullable();
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTable(EDITIONS);
};
