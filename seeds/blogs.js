const fs = require("fs");
const readline = require("readline");

const BLOGS = "blogs";
const SEQ = "blogs_id_seq";
const blogs = [];
let maxId = 0;

const rl = readline.createInterface({
    input: fs.createReadStream("./seed-data/blogs.jsonl")
});

rl.on("line", line => {

    const blog = JSON.parse(line);
    if (blog.id > maxId) {
        maxId = blog.id;
    }
    blogs.push(blog);
});

exports.seed = function (knex, Promise) {

    return knex(BLOGS).del()
        .then(function () {

            const insert = () => Promise.all(blogs.map(blog => {

                blog.authors = JSON.stringify(blog.authors);
                return knex(BLOGS).insert(blog);
            }))
                .then(() => Promise.resolve(
                    knex.raw(`ALTER SEQUENCE ${SEQ} RESTART WITH ${maxId + 1};`)));

            return new Promise(resolve => {

                rl.on("close", resolve(insert()));
            })
        });
};
