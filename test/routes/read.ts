import * as Hapi from "hapi";
// import * as Knex from "knex";
import { script } from "lab";
import { expect } from "code";

import { Models } from "savitri-shared";
const LabbableServer = require("../../server");
// import { ServerPlugins } from "../../src/plugins";

const lab = exports.lab = script();

const { suite, test, before, after } = lab;

let server: Hapi.Server;
// let pg: Knex;

before(done => {

    LabbableServer.ready((err: Error, srv: Hapi.Server) => {

        if (err) {
            return done(err);
        }

        server = srv;

        // const plugins: ServerPlugins = server.plugins;

        // pg = plugins.knex.pg;

        // db.collection(Edition.collection).insertMany([FirstEdition, RevisedEdition])
        //     .then(() => done())
        //     .catch(err => done(err));
        return done();
    });
});

suite("The read plugin", () => {

    test("returns the correct section of the First Edition", done => {

        const request = {
            method: "GET",
            url: "/savitri/books/3/cantos/2/sections/1",
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);
            const section: Models.ISection = JSON.parse(response.payload).data;
            expect(section.running_no).to.equal(80);

            if (section.sentences) {

                expect(section.sentences.length).to.equal(22);
            }

            return done();
        });
    });

    test("returns the correct section of the Revised Edition", done => {

        const request = {
            method: "GET",
            url: "/savitri/books/3/cantos/2/sections/1?edition=1993",
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);
            const section: Models.ISection = JSON.parse(response.payload).data;
            expect(section.running_no).to.equal(79);

            if (section.sentences) {

                expect(section.sentences.length).to.equal(20);
            }

            return done();
        });
    });

    test("returns the correct sentence of the First Edition", done => {

        const request = {
            method: "GET",
            url: "/savitri/books/3/cantos/2/sections/1/sentences/3",
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const sentence: Models.ISentence = JSON.parse(response.payload).data;
            expect(sentence.lines[0]).to.equal("O soul, it is too early to rejoice!");

            return done();
        });
    });

    test("returns the correct sentence of the Revised Edition", done => {

        const request = {
            method: "GET",
            url: "/savitri/books/3/cantos/2/sections/1/sentences/1?edition=1993",
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const sentence: Models.ISentence = JSON.parse(response.payload).data;
            expect(sentence.lines[6]).to.equal("Prolonging an imaged unreality.");

            return done();
        });
    });
});

after(done => {

    // db.dropCollection(Edition.collection)
    //     .then(() => done())
    //     .catch((err) => done(err));
    return done();
});
