import { Request, IReply } from "hapi";
import * as Boom from "boom";

import { Models } from "savitri-shared";
import { BaseController } from "./BaseController";
import { Params, PreParams, PreResponses } from "../routes/blogs";

export class BlogsController extends BaseController {
    returnBlog = (request: Request, reply: IReply) => {

        const preParams: PreParams = request.pre;
        const preResponses: PreResponses = request.preResponses;

        if (!preParams.blog) {

            const error = {
                errors: [Boom.notFound("Blog not found").output.payload],
                url: request.url.path
            };

            return reply(error).code(404);
        }

        const blog = {
            data: preParams.blog,
            url: request.url.path
        };

        return reply(blog).code(preResponses.blog.statusCode);
    }

    returnBlogs = (request: Request, reply: IReply) => {

        const preParams: PreParams = request.pre;

        const blogs = {
            data: preParams.blogs,
            url: request.url.path
        };

        return reply(blogs);
    }

    retrieveBlog = (request: Request, reply: IReply) => {

        const params: Params = request.params;

        return reply(this.table().where({ slug: params.blog }).first());
    }

    retrieveBlogs = (request: Request, reply: IReply) => {

        return reply(this.table().select("*").orderBy("order"));
    }

    insertBlog = (request: Request, reply: IReply) => {

        const blog = new Models.Blog(request.payload);

        this.table()
            .insert(blog.model, "*")
            .then(results => reply(results[0]).code(201));
    }

    patchBlog = (request: Request, reply: IReply) => {

        const params: Params = request.params;

        this.table()
            .update(request.payload, "*")
            .where({ slug: params.blog })
            .then(results => reply(results[0]));
    }

    deleteBlog = (request: Request, reply: IReply) => {

        const params: Params = request.params;

        this.table()
            .delete()
            .where({ slug: params.blog })
            .then(result => reply({}));
    }
}
