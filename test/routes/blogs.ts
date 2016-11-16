import * as Hapi from "hapi";
import * as Code from "code";
import * as Knex from "knex";
import { script } from "lab";

const LabbableServer = require("../../server");
const newBlog = require("../fixtures/newBlog.json");
import { Models } from "savitri-shared";

const lab = exports.lab = script();
const expect = Code.expect;

const { suite, test, before, after } = lab;

let server: Hapi.Server;
let pg: Knex;

before(done => {

    LabbableServer.ready((err: Error, srv: Hapi.Server) => {

        if (err) {
            return done(err);
        }

        server = srv;

        pg = server.plugins["knex"].pg;

        return done();
    });
});

suite("The blogs plugin", () => {

    test("gets all blogs in the correct order", done => {

        const request = {
            method: "GET",
            url: "/blogs"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const blog: Models.IBlog[] = JSON.parse(response.payload).data;
            expect(blog[0].slug).to.equal("savitri-cultural");
            expect(blog[1].slug).to.equal("light-of-supreme");

            return done();
        });
    });

    test("returns specified blog", done => {

        const request = {
            method: "GET",
            url: "/blogs/light-of-supreme"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const blog: Models.IBlog = JSON.parse(response.payload).data;
            expect(blog.title).to.equal("The Light of the Supreme");

            return done();
        });
    });

    test("returns 404 if the blog is not found", done => {

        const request = {
            method: "GET",
            url: "/blogs/prayers-and-meditations"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(404);

            return done();
        });
    });

    test.skip("successfully creates a new blog", done => {

        const request: Hapi.IServerInjectOptions = {
            method: "POST",
            url: "/blogs",
            payload: newBlog
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(201);

            const newBlog: Models.IBlog = JSON.parse(response.payload).data;

            expect(newBlog.id).to.exist();

            expect(newBlog.slug).to.equal("new-blog");

            return done();
        });
    });

    test.skip("successfully updates a blog", done => {

        const request: Hapi.IServerInjectOptions = {
            method: "PATCH",
            url: "/blogs/new-blog",
            payload: Object.assign(newBlog, { order: 8 })
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const updatedBlog: Models.IBlog = JSON.parse(response.payload).data;

            expect(updatedBlog.order).to.equal(8);

            return done();
        });
    });

    test.skip("successfully deletes a blog", done => {

        const request: Hapi.IServerInjectOptions = {
            method: "DELETE",
            url: "/blogs/new-blog",
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            return done();
        });
    });
});

after(done => {

    return done();
});
