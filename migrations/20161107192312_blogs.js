const BLOGS = "blogs";

exports.up = function (knex, Promise) {

    return knex.schema.createTable(BLOGS, table => {

        table.increments();
        table.integer("order");
        table.string("slug").notNullable();
        table.string("title").notNullable();
        table.string("subtitle");
        table.json("authors").notNullable();
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTable(BLOGS);
};
