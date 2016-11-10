const SENTENCES = "sentences";

exports.up = function (knex, Promise) {

    return knex.schema.createTable(SENTENCES, table => {

        table.increments();
        table.integer("no").notNullable();
        table.integer("section_id").notNullable();
        table.string("ref_id");
        table.json("ref_ids");
        table.json("lines").notNullable();
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTable(SENTENCES);
};
