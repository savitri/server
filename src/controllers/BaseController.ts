import * as Knex from "knex";

export class BaseController {
    protected pg: Knex;
    protected tableName: string;

    init(pg: Knex, table: string) {

        this.pg = pg;
        this.tableName = table;
    };

    table() {

        return this.pg.table(this.tableName);
    }
}
