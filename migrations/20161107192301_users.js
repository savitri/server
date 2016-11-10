const USERS = "users";

exports.up = function (knex, Promise) {

    return knex.schema.createTable(USERS, table => {

        table.increments();
        table.string("name").notNullable();
        table.string("username");
        table.string("email");
        table.string("photo");
        table.integer("role_id");
        table.timestamp("created_at").notNullable();
        table.timestamp("updated_at").notNullable();
        table.string("encrypted_password");
        table.string("reset_password_token");
        table.timestamp("reset_password_sent_at");
        table.timestamp("remember_created_at");
        table.integer("sign_in_count");
        table.timestamp("current_sign_in_at");
        table.timestamp("last_sign_in_at");
        table.string("current_sign_in_ip");
        table.string("last_sign_in_ip");
        table.string("confirmation_token");
        table.timestamp("confirmed_at");
        table.timestamp("confirmation_sent_at");
        table.string("unconfirmed_email");
        table.string("invitation_token");
        table.timestamp("invitation_sent_at");
        table.timestamp("invitation_accepted_at");
        table.integer("invitation_limit");
        table.integer("invited_by_id");
        table.string("invited_by_type");
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTable(USERS);
};
