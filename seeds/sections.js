const fs = require("fs");
const readline = require("readline");

const SECTIONS = "sections";
const SEQ = "sections_id_seq";
const sections = [];
let maxId = 0;

const rl = readline.createInterface({
    input: fs.createReadStream("./seed-data/sections.jsonl")
});

rl.on("line", line => {

    const section = JSON.parse(line);
    if (section.id > maxId) {
        maxId = section.id;
    }
    sections.push(section);
});

exports.seed = function(knex, Promise) {

    return knex(SECTIONS).del()
        .then(function() {

            const insert = () => Promise.all(sections.map(section => knex(SECTIONS).insert(section)))
                .then(Promise.resolve(
                    knex.raw(`ALTER SEQUENCE ${SEQ} RESTART WITH ${maxId + 1};`)));

            return new Promise(resolve => {

                rl.on("close", resolve(insert()));
            });
        });
};
