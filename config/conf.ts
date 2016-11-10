import * as Confidence from "confidence";

const criteria = {
    env: process.env.NODE_ENV
};

const config = {
    projectName: "savitri",
    port: {
        api: {
            $filter: "env",
            test: 7171,
            production: 9191,
            $default: 8181
        }
    },
    db: {
        name: {
            $filter: "env",
            test: "savitri_test",
            production: "savitri",
            $default: "savitri_development"
        }
    }
};

const store = new Confidence.Store(config);

export const get = (key: string) => {

    return store.get(key, criteria);
};
