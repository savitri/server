const fs = require("fs");
const readline = require("readline");

const BOOKS = "books";
const SEQ = "books_id_seq";
const books = [];
let maxId = 0;

const rl = readline.createInterface({
    input: fs.createReadStream("./seed-data/books.jsonl")
});

rl.on("line", line => {

    const book = JSON.parse(line);
    if (book.id > maxId) {
        maxId = book.id;
    }
    books.push(book);
});

exports.seed = function (knex, Promise) {

    return knex(BOOKS).del()
        .then(function () {

            const insert = () => Promise.all(books.map(book => knex(BOOKS).insert(book)))
                .then(() => Promise.resolve(
                    knex.raw(`ALTER SEQUENCE ${SEQ} RESTART WITH ${maxId + 1};`)));

            return new Promise(resolve => {

                rl.on("close", resolve(insert()));
            })
        });
};
