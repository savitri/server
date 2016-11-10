import { Server } from "hapi";
import * as Lab from "lab";
import * as Code from "code";
import * as Knex from "knex";

const Composer = require("../config");

import { get } from "../config/conf";

const lab = exports.lab = Lab.script();
const expect = Code.expect;

let server: Server;
let pg: Knex;

lab.experiment("The app", () => {

    lab.test("composes", (done: any) => {

        Composer((err: Error, composedServer: any) => {

            server = composedServer;

            expect(composedServer).to.be.an.object();

            return done(err);
        });
    });

    lab.test("has a valid database connection", (done: any) => {

        pg = server.plugins["knex"].pg;
        const testDb = get("/db/name");

        expect(pg).to.be.a.function();
        expect(testDb).to.equal(pg.client.connectionSettings.database);

        return done();
    });

});
