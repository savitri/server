const fs = require("fs");
const readline = require("readline");

const SENTENCES = "sentences";
const SEQ = "sentences_id_seq";
const sentences = [];
let maxId = 0;

const rl = readline.createInterface({
    input: fs.createReadStream("./seed-data/sentences.jsonl")
});

rl.on("line", line => {

    const sentence = JSON.parse(line);
    if (sentence.id > maxId) {
        maxId = sentence.id;
    }
    sentences.push(sentence);
});

exports.seed = function(knex, Promise) {

    return knex(SENTENCES).del()
        .then(function() {

            const insert = () => Promise.all(sentences.map(sentence => {

                sentence.lines = JSON.stringify(sentence.lines);

                if (sentence.refIds) {
                    sentence.ref_ids = JSON.stringify(sentence.refIds);
                    delete sentence.refIds;
                }

                if (sentence.refId) {
                    sentence.ref_id = sentence.refId;
                    delete sentence.refId;;
                }

                return knex(SENTENCES).insert(sentence);
            }))
                .then(Promise.resolve(
                    knex.raw(`ALTER SEQUENCE ${SEQ} RESTART WITH ${maxId + 1};`)));

            return new Promise(resolve => {

                rl.on("close", resolve(insert()));
            });
        });

};
