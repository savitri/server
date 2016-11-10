import * as Confidence from "confidence";

import * as Config from "./conf";

const criteria = {
    env: process.env.NODE_ENV || "development"
};

const manifest = {
    server: {
        debug: {
            request: ["error"]
        },
        connections: {
            routes: {
                security: true,
                cors: true
            }
        },
        load: {
            sampleInterval: 1000
        }
    },
    connections: [{
        port: Config.get("/port/api"),
        labels: ["api"],
        routes: {
            validate: {
                failAction: require("relish")({ stripQuotes: true }).failAction,
            }
        }
    }],
    registrations: [
        {
            plugin: {
                register: "../src/plugins/knex",
                options: require("../knexfile")[criteria.env]
            }
        },
        {
            plugin: {
                register: "hapi-swagger",
                options: {
                    info: {
                        title: "Savitri",
                        version: "v1"
                    }
                }
            }
        },
        {
            plugin: "inert"
        },
        {
            plugin: "vision"
        },
        {
            plugin: "../src/routes/read"
        },
        {
            plugin: "../src/routes/editions"
        },
        {
            plugin: "../src/routes/blogs"
        },
        {
            plugin: "../src/routes/posts"
        },
    ]
};

const store = new Confidence.Store(manifest);

export const get = (key: string) => {

    return store.get(key, criteria);
};
