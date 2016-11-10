const fs = require("fs");
const readline = require("readline");

const USERS = "users";
const SEQ = "users_id_seq";
const users = [];
let maxId = 0;

const rl = readline.createInterface({
    input: fs.createReadStream("./seed-data/users.jsonl")
});

rl.on("line", line => {

    const user = JSON.parse(line);
    if (user.id > maxId) {
        maxId = user.id;
    }
    users.push(user);
});

exports.seed = function (knex, Promise) {

    return knex(USERS).del()
        .then(function () {

            const insert = () => Promise.all(users.map(user => knex(USERS).insert(user)))
                .then(() => Promise.resolve(
                    knex.raw(`ALTER SEQUENCE ${SEQ} RESTART WITH ${maxId + 1};`)));

            return new Promise(resolve => {

                rl.on("close", resolve(insert()));
            })
        });
};
