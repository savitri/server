const POSTS = "posts";

exports.up = function (knex, Promise) {

    return knex.schema.createTable(POSTS, table => {

        table.increments();
        table.integer("blog_id").notNullable();
        table.integer("number");
        table.integer("author_id").notNullable();
        table.string("slug").notNullable();
        table.text("title").notNullable();
        table.text("subtitle");
        table.text("txt").notNullable();
        table.text("excerpt");
        table.string("script");
        table.integer("series_id");
        table.jsonb("comments");
        table.jsonb("tags");
        table.jsonb("recommendations");
        table.string("status").notNullable();
        table.timestamp("created_at").notNullable();
        table.timestamp("published_at");
        table.timestamp("updated_at");
        table.timestamp("deleted_at");
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTable(POSTS);
};
