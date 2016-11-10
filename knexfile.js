const Config = require("./config/conf");

module.exports = {

    development: {
        client: "postgresql",
        connection: {
            database: Config.get("/db/name")
        },
        pool: {
            min: 2,
            max: 10
        }
    },

    test: {
        client: "postgresql",
        connection: {
            database: Config.get("/db/name")
        },
        pool: {
            min: 2,
            max: 10
        }
    },

    production: {
        client: "postgresql",
        connection: {
            database: Config.get("/db/name"),
            user: "username",
            password: "password"
        },
        pool: {
            min: 2,
            max: 10
        }
    }
};
