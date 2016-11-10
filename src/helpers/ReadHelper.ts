import * as Knex from "knex";
import { Models } from "savitri-shared";

import { Params, Query } from "../routes/read";

export class ReadHelper {
    static getSection = function (pg: Knex, query: Query, params: Params) {
        const editionId = function () {

            (<Knex>this).select("id").from(Models.Edition.table).where({ year: query.edition });
        };

        const bookId = function () {

            (<Knex>this).table(Models.Book.table)
                .where({
                    "books.edition_id": editionId
                })
                .andWhere({ "books.no": params.book })
                .first("id");
        };

        const cantoId = function () {

            (<Knex>this).table(Models.Canto.table)
                .where({
                    "cantos.book_id": bookId
                })
                .andWhere({ "cantos.no": params.canto })
                .first("id");
        };

        return pg.table(Models.Section.table)
            .select("sections.*", pg.raw("json_agg(sentences order by sentences.no) as sentences"))
            .innerJoin("sentences", "sentences.section_id", "sections.id")
            .where({
                "sections.canto_id": cantoId
            })
            .andWhere({ "sections.no": params.section })
            .groupBy("sections.id").first();
    };

    static getSentence = function (pg: Knex, query: Query, params: Params) {

        const editionId = function () {

            (<Knex>this).select("id").from(Models.Edition.table).where({ year: query.edition });
        };

        const bookId = function () {

            (<Knex>this).table(Models.Book.table)
                .where({
                    "books.edition_id": editionId
                })
                .andWhere({ "books.no": params.book })
                .first("id");
        };

        const cantoId = function () {

            (<Knex>this).table(Models.Canto.table)
                .where({
                    "cantos.book_id": bookId
                })
                .andWhere({ "cantos.no": params.canto })
                .first("id");
        };

        const sectionId = function () {

            (<Knex>this).table(Models.Section.table)
                .where({
                    "canto_id": cantoId
                })
                .andWhere({ "no": params.section })
                .first("id");
        };


        return pg.table(Models.Sentence.table)
            .where({ section_id: sectionId })
            .andWhere({ no: params.sentence })
            .first();
    };
}
