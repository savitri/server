import { Server } from "hapi";
import * as Joi from "joi";

import { ReadController } from "../controllers/ReadController";
import { ServerPlugins } from "../../src/plugins";
import { Models } from "savitri-shared";

export interface Params {
    book?: number;
    canto?: number;
    section?: number;
    sentence?: number;
}

export interface Query {
    edition?: string;
}

export interface PreParams {
    section?: Models.ISection;
    sentence?: Models.ISentence;
}

exports.register = (server: Server, options: any, next: Function) => {

    const controller = new ReadController();

    server.dependency(["knex"], (server: Server, next: Function) => {

        controller.init((<ServerPlugins>server.plugins).knex.pg, Models.Edition.table);

        return next();
    });

    server.route({
        method: "GET",
        path: "/savitri/books/{book}/cantos/{canto}/sections/{section}",
        handler: controller.replySection,
        config: {
            tags: ["api"],
            validate: {
                params: {
                    book: Joi.number().required(),
                    canto: Joi.number().required(),
                    section: Joi.number().required()
                },
                query: {
                    edition: Joi.number().optional().default(1950, "Return first edition by default"),
                }
            },
            pre: [
                {
                    method: controller.getSection,
                    assign: "section"
                }
            ]
        }
    });

    server.route({
        method: "GET",
        path: "/savitri/books/{book}/cantos/{canto}/sections/{section}/sentences/{sentence}",
        handler: controller.replySentence,
        config: {
            tags: ["api"],
            validate: {
                params: {
                    book: Joi.string().required(),
                    canto: Joi.string().required(),
                    section: Joi.string().required(),
                    sentence: Joi.string().required()
                },
                query: {
                    edition: Joi.string().optional().default("1950", "Return first edition by default")
                }
            },
            pre: [
                {
                    method: controller.getSentence,
                    assign: "sentence"
                }
            ]
        }
    });

    return next();
};

exports.register.attributes = {
    name: "read"
};
