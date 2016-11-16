import * as Hapi from "hapi";
import { script } from "lab";
import { expect } from "code";

const LabbableServer = require("../../server");
import { Models } from "savitri-shared";

const lab = exports.lab = script();

const { before, suite, test } = lab;

let server: Hapi.Server;

before(done => {

    LabbableServer.ready((err: Error, srv: Hapi.Server) => {

        if (err) {
            return done(err);
        }

        server = srv;

        return done();
    });
});

suite("The editions plugin", () => {

    test("gets the list of editions", done => {

        const request = {
            method: "GET",
            url: "/savitri/editions",
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const editions: Models.IEdition[] = JSON.parse(response.payload).data;

            expect(editions.length).to.equal(3);

            expect(editions[0].year).to.equal(1950);

            return done();
        });
    });

    test("gets the First Edition's TOC", done => {

        const request = {
            method: "GET",
            url: "/savitri/editions/1950"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const edition: Models.IEdition = JSON.parse(response.payload).data;

            expect(edition.year).to.equal(1950);

            expect(edition.toc.parts.length).to.equal(3);

            return done();
        });
    });
});
