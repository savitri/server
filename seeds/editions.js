const fs = require("fs");
const readline = require("readline");

const EDITIONS = "editions";
const SEQ = "editions_id_seq";
const editions = [];
let maxId = 0;

const rl = readline.createInterface({
    input: fs.createReadStream("./seed-data/editions.jsonl")
});

rl.on("line", line => {

    const edition = JSON.parse(line);
    edition.toc = require(`../seed-data/toc-edition-${edition.id}.json`);
    if (edition.id > maxId) {
        maxId = edition.id;
    }
    editions.push(edition);
});

exports.seed = function(knex, Promise) {

    return knex(EDITIONS).del()
        .then(function() {

            const insert = () => Promise.all(editions.map(edition => knex(EDITIONS).insert(edition)))
                .then(Promise.resolve(
                    knex.raw(`ALTER SEQUENCE ${SEQ} RESTART WITH ${maxId + 1};`)));

            return new Promise(resolve => {

                rl.on("close", resolve(insert()));
            });
        });
};
