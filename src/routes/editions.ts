import { Server } from "hapi";
import * as Joi from "joi";
import { Models } from "savitri-shared";

import { EditionsController } from "../controllers/EditionsController";
import { ServerPlugins } from "../../src/plugins";

export interface Params {
    year?: number;
}

export interface PreParams {
    editions?: Models.IEdition[];
    edition?: Models.IEdition;
}

exports.register = (server: Server, options: any, next: Function) => {

    const controller = new EditionsController();

    server.dependency(["knex"], (server: Server, next: Function) => {

        controller.init((<ServerPlugins>server.plugins).knex.pg, Models.Edition.table);

        return next();
    });

    server.route({
        path: "/savitri/editions",
        method: "GET",
        handler: controller.replyEditions,
        config: {
            tags: ["api"],
            pre: [
                {
                    method: controller.retrieveEditions,
                    assign: "editions"
                }
            ]
        }
    });

    server.route({
        path: "/savitri/editions/{year}",
        method: "GET",
        handler: controller.replyEdition,
        config: {
            tags: ["api"],
            validate: {
                params: {
                    year: Joi.number()
                }
            },
            pre: [
                {
                    method: controller.retrieveEdition,
                    assign: "edition"
                }
            ]
        }
    });

    return next();
};

exports.register.attributes = {
    name: "editions"
};
