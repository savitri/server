const fs = require("fs");
const readline = require("readline");

const PARTS = "parts";
const SEQ = "parts_id_seq";
const parts = [];
let maxId = 0;

const rl = readline.createInterface({
    input: fs.createReadStream("./seed-data/parts.jsonl")
});

rl.on("line", line => {

    const part = JSON.parse(line);
    if (part.id > maxId) {
        maxId = part.id;
    }
    parts.push(part);
});

exports.seed = function(knex, Promise) {

    return knex(PARTS).del()
        .then(function() {

            const insert = () => Promise.all(parts.map(part => knex(PARTS).insert(part)))
                .then(Promise.resolve(
                    knex.raw(`ALTER SEQUENCE ${SEQ} RESTART WITH ${maxId + 1};`)));

            return new Promise(resolve => {

                rl.on("close", resolve(insert()));
            });
        });
};
