const TAGS = "tags";

exports.up = function (knex, Promise) {

    return knex.schema.createTable(TAGS, table => {

        table.increments();
        table.string("slug").notNullable();
        table.text("name").notNullable();
        table.integer("blog_id").notNullable();
        table.boolean("series");
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTable(TAGS);
};
