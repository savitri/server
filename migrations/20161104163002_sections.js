const SECTIONS = "sections";

exports.up = function (knex, Promise) {

    return knex.schema.createTable(SECTIONS, table => {

        table.increments();
        table.integer("no").notNullable();
        table.integer("running_no").notNullable();
        table.integer("canto_id").notNullable();
        table.string("heading").notNullable();
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTable(SECTIONS);
};
