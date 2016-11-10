import { Request, IReply } from "hapi";
import * as Boom from "boom";

import { BaseController } from "./BaseController";

import { Params, PreParams } from "../routes/editions";

export class EditionsController extends BaseController {
    replyEditions = (request: Request, reply: IReply) => {

        const preParams: PreParams = request.pre;

        const editions = {
            data: preParams.editions,
            url: request.url.path
        };

        return reply(editions);
    }

    replyEdition = (request: Request, reply: IReply) => {

        const preParams: PreParams = request.pre;

        if (!preParams.edition) {

            const error = {
                errors: [Boom.notFound("Edition not found").output.payload],
                url: request.url.path
            };

            return reply(error).code(404);
        }

        const edition = {
            data: preParams.edition,
            url: request.url.path
        };

        return reply(edition);
    }

    retrieveEditions = (request: Request, reply: IReply) => {

        return reply(this.table().select(["id", "title", "year"]).orderBy("year"));
    }

    retrieveEdition = (request: Request, reply: IReply) => {

        const params: Params = request.params;

        return reply(this.table().where({ year: params.year }).first());
    }
}
