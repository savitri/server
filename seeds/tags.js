const fs = require("fs");
const readline = require("readline");

const TAGS = "tags";
const SEQ = "tags_id_seq";
const tags = [];
let maxId = 0;

const rl = readline.createInterface({
    input: fs.createReadStream("./seed-data/tags.jsonl")
});

rl.on("line", line => {

    const tag = JSON.parse(line);
    if (tag.id > maxId) {
        maxId = tag.id;
    }
    tags.push(tag);
});

exports.seed = function(knex, Promise) {

    return knex(TAGS).del()
        .then(function() {

            const insert = () => Promise.all(tags.map(tag => knex(TAGS).insert(tag)))
                .then(Promise.resolve(
                    knex.raw(`ALTER SEQUENCE ${SEQ} RESTART WITH ${maxId + 1};`)));

            return new Promise(resolve => {

                rl.on("close", resolve(insert()));
            });
        });
};
