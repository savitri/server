import * as Hapi from "hapi";
const Exiting = require("exiting");
const Labbable = require("labbable");
// require("nodejs-dashboard");

const Composer = require("./config");

const labbable = module.exports = new Labbable();

Composer((err: Error, server: Hapi.Server) => {

    if (err) {
        throw err;
    }

    labbable.using(server);

    server.initialize((err: Error) => {

        if (err) {
            throw err;
        }


        if (module.parent) {
            return;
        }

        new Exiting.Manager(server).start((err: Error) => {

            if (err) {
                throw err;
            }

            console.log("Server started on port", server.info.port, "in", process.env.NODE_ENV || "development");
        });
    });
});
