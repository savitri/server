import { Request, IReply } from "hapi";
import * as Boom from "boom";

import { BaseController } from "./BaseController";
// import { Edition, Book, IBook, Canto, ICanto, Section, Sentence } from "../models";

import { ReadHelper } from "../helpers/ReadHelper";

import { Params, Query, PreParams } from "../routes/read";

export class ReadController extends BaseController {
    getSection = (request: Request, reply: IReply) => {

        const params: Params = request.params;
        const query: Query = request.query;

        const queries = ReadHelper.getSection(this.pg, query, params);

        Promise.all(queries).then(results => {

            return reply({
                canto: results[0],
                section: results[1]
            });
        });
    }

    replySection = (request: Request, reply: IReply) => {

        const preParams: PreParams = request.pre;

        if (!preParams.sectionCanto) {

            const error = {
                errors: [Boom.notFound("Section not found").output.payload],
                url: request.url.path
            };

            return reply(error).code(404);
        }

        const section = {
            data: preParams.sectionCanto,
            url: request.url.path
        };

        return reply(section);
    }

    getSentence = (request: Request, reply: IReply) => {

        const params: Params = request.params;
        const query: Query = request.query;

        const sentence = ReadHelper.getSentence(this.pg, query, params);

        return reply(sentence);

        // return reply(this.dbCollection.aggregate([
        //     { $match: { year: query.edition } },
        //     { $unwind: "$parts" },
        //     { $unwind: "$parts.books" },
        //     { $match: { "parts.books.id": params.book } },
        //     { $unwind: "$parts.books.cantos" },
        //     { $match: { "parts.books.cantos.id": params.canto } },
        //     { $unwind: "$parts.books.cantos.sections" },
        //     { $match: { "parts.books.cantos.sections.id": params.section } },
        //     { $unwind: "$parts.books.cantos.sections.sentences" },
        //     { $match: { "parts.books.cantos.sections.sentences.id": params.sentence } },
        //     { $project: { data: "$parts.books.cantos.sections.sentences", _id: 0 } },
        // ]).limit(1).next());
    }

    replySentence = (request: Request, reply: IReply) => {

        const preParams: PreParams = request.pre;

        if (!preParams.sentence) {

            const error = {
                errors: [Boom.notFound("Sentence not found").output.payload],
                url: request.url.path
            };

            return reply(error).code(404);
        }

        const sentence = {
            data: preParams.sentence,
            url: request.url.path
        };

        return reply(sentence);
    }
}
