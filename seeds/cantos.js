const fs = require("fs");
const readline = require("readline");

const CANTOS = "cantos";
const SEQ = "cantos_id_seq";
const cantos = [];
let maxId = 0;

const rl = readline.createInterface({
    input: fs.createReadStream("./seed-data/cantos.jsonl")
});

rl.on("line", line => {

    const canto = JSON.parse(line);
    if (canto.id > maxId) {
        maxId = canto.id;
    }
    cantos.push(canto);
});

exports.seed = function(knex, Promise) {

    return knex(CANTOS).del()
        .then(function() {

            const insert = () => Promise.all(cantos.map(canto => knex(CANTOS).insert(canto)))
                .then(Promise.resolve(
                    knex.raw(`ALTER SEQUENCE ${SEQ} RESTART WITH ${maxId + 1};`)));

            return new Promise(resolve => {

                rl.on("close", resolve(insert()));
            });
        });
};
