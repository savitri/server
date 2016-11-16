import * as Hapi from "hapi";
import * as Knex from "knex";
import { expect } from "code";
import { script } from "lab";

import { Models } from "savitri-shared";
const LabbableServer = require("../../server");
import { newPost, existingPost } from "../fixtures/new-post";
import { POSTS_PER_PAGE } from "../../src/controllers/PostsController";

const lab = exports.lab = script();

const { suite, test, before, after } = lab;

let server: Hapi.Server;
let pg: Knex;
let firstPageLastPost: Models.IPost;

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

suite("The posts plugin", () => {

    test("returns first page of posts from The Light of the Supreme", done => {

        const request = {
            method: "GET",
            url: "/blogs/light-of-supreme/posts"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const posts: Models.IPost[] = JSON.parse(response.payload).data;

            expect(posts.length).to.equal(POSTS_PER_PAGE);

            expect(posts[0].blog_id).to.equal(1);

            firstPageLastPost = posts[POSTS_PER_PAGE - 1];

            expect(posts[POSTS_PER_PAGE - 2].number).to.be.above(firstPageLastPost.number);

            return done();
        });
    });

    test("returns page 2 of posts from The Light of the Supreme", done => {

        const request = {
            method: "GET",
            url: "/blogs/light-of-supreme/posts?page=2"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const posts: Models.IPost[] = JSON.parse(response.payload).data;

            expect(posts.length).to.equal(POSTS_PER_PAGE);

            expect(posts[0].blog_id).to.equal(1);

            expect(posts[0].number).to.be.below(firstPageLastPost.number);

            return done();
        });
    });

    test("returns posts from Savitri Cultural", done => {

        const request = {
            method: "GET",
            url: "/blogs/savitri-cultural/posts"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const posts: Models.IPost[] = JSON.parse(response.payload).data;

            expect(posts.length).to.equal(POSTS_PER_PAGE);

            expect(posts[0].blog_id).to.equal(6);

            return done();
        });
    });

    test("returns 404 if the blog doesn't exist", done => {

        const request = {
            method: "GET",
            url: "/blogs/unknown-blog/posts"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(404);

            return done();
        });
    });

    test("returns the expected post", done => {

        const request = {
            method: "GET",
            url: "/blogs/light-of-supreme/posts/07-the-simple-life"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const post: Models.IPost = JSON.parse(response.payload).data;

            expect(post.title).to.equal("07: The Simple Life");

            return done();
        });
    });

    test("returns 404 if the post doesn't exist", done => {

        const request = {
            method: "GET",
            url: "/blogs/light-of-supreme/posts/om-sri-aurobindo-mira"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(404);

            const responseObj = JSON.parse(response.payload);

            expect(responseObj.errors[0].message).to.equal("Post not found");

            return done();
        });
    });

    test("successfully creates a new post", done => {

        const request = {
            method: "POST",
            url: "/blogs/light-of-supreme/posts",
            payload: newPost
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(201);

            const post: Models.IPost = JSON.parse(response.payload).data;

            expect(post.slug).to.equal("the-post-title");

            expect(post.created_at).to.exist();

            return done();
        });
    });

    test("generates a unique slug for each post", done => {

        const request = {
            method: "POST",
            url: "/blogs/flower-blog/posts",
            payload: newPost
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(201);

            const post: Models.IPost = JSON.parse(response.payload).data;

            expect(post.slug).to.equal("the-post-title-1");

            expect(post.created_at).to.exist();

            return done();
        });
    });

    test("successfully updates a post", done => {

        const update = {
            txt: "Changed text"
        };

        const request = {
            method: "PATCH",
            url: "/blogs/light-of-supreme/posts/the-post-title",
            payload: Object.assign(existingPost, update)
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            const post: Models.IPost = JSON.parse(response.payload).data;

            expect(post.txt).to.equal(update.txt);

            return done();
        });
    });

    test.skip("gets all posts with a given tag", done => {

        expect(false).to.equal(true);

        return done();
    });

    test.skip("gets all series from a blog", done => {

        expect(false).to.equal(true);

        return done();
    });

    test("successfully deletes first post", done => {

        const request = {
            method: "DELETE",
            url: "/blogs/light-of-supreme/posts/the-post-title"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            return done();
        });
    });

    test("successfully deletes second post", done => {

        const request = {
            method: "DELETE",
            url: "/blogs/light-of-supreme/posts/the-post-title-1"
        };

        server.inject(request, response => {

            expect(response.statusCode).to.equal(200);

            return done();
        });
    });
});

after(done => {

    pg("posts")
        .delete()
        .where({
            blog_id: 1,
            slug: "the-post-title"
        })
        .then(() => {

            pg("posts").delete()
                .where({
                    blog_id: 1,
                    slug: "the-post-title-1"
                }).then(() => done())
                .catch(done);
        })
        .catch(done);
});
