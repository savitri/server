import * as Hapi from "hapi";
import * as Knex from "knex";

exports.register = (server: Hapi.Server, options: any, next: Function) => {

    const pg = Knex(options);

    server.expose("pg", pg);

    server.on("stop", () => {

        pg.destroy();
    });

    return next();
};

exports.register.attributes = {
    name: "knex"
};
