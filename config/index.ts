const Glue = require("glue");

import * as Manifest from "./manifest";

const composeOptions = {
    relativeTo: __dirname
};

module.exports = Glue.compose.bind(Glue, Manifest.get("/"), composeOptions);
