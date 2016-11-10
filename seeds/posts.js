const fs = require("fs");
const readline = require("readline");

const POSTS = "posts";
const SEQ = "posts_id_seq";
const posts = [];
let maxId = 0;

const rl = readline.createInterface({
    input: fs.createReadStream("./seed-data/posts.jsonl")
});

rl.on("line", line => {

    const post = JSON.parse(line);
    if (post.id > maxId) {
        maxId = post.id;
    }
    posts.push(post);
});

exports.seed = function(knex, Promise) {

    return knex(POSTS).del()
        .then(function() {

            const insert = () => Promise.all(posts.map(post => {

                post.tags = JSON.stringify(post.tags);

                return knex(POSTS).insert(post);
            }))
                .then(Promise.resolve(
                    knex.raw(`ALTER SEQUENCE ${SEQ} RESTART WITH ${maxId + 1};`)));

            return new Promise(resolve => {

                rl.on("close", () => {

                    return resolve(insert());
                });
            });
        });
};
