import { Server, Response } from "hapi";
import * as Joi from "joi";

import { Models } from "savitri-shared";
import { BlogsController } from "../controllers/BlogsController";
import { ServerPlugins } from "../plugins";

export interface Params {
    blog?: string;
}

export interface Query { }

export interface PreParams {
    blog?: Models.IBlog;
    blogs?: Models.IBlog[];
}

export interface PreResponses {
    blog: Response;
}

exports.register = (server: Server, options: any, next: Function) => {

    const controller = new BlogsController();

    server.dependency(["knex"], (server: Server, next: Function) => {

        controller.init((<ServerPlugins>server.plugins).knex.pg, Models.Blog.table);

        return next();
    });

    server.route({
        method: "GET",
        path: "/blogs",
        handler: controller.returnBlogs,
        config: {
            tags: ["api"],
            pre: [
                {
                    method: controller.retrieveBlogs,
                    assign: "blogs"
                }
            ]
        }
    });

    server.route({
        method: "POST",
        path: "/blogs",
        handler: controller.returnBlog,
        config: {
            tags: ["api"],
            validate: {
                payload: Models.Blog.schema
            },
            pre: [
                {
                    method: controller.insertBlog,
                    assign: "blog"
                }
            ]
        }
    });

    server.route({
        method: "GET",
        path: "/blogs/{blog}",
        handler: controller.returnBlog,
        config: {
            tags: ["api"],
            validate: {
                params: {
                    blog: Joi.string().required()
                }
            },
            pre: [
                {
                    method: controller.retrieveBlog,
                    assign: "blog"
                }
            ]
        }
    });

    server.route({
        method: "PATCH",
        path: "/blogs/{blog}",
        handler: controller.returnBlog,
        config: {
            tags: ["api"],
            validate: {
                params: {
                    blog: Joi.string().required()
                },
                payload: Models.Blog.schema
            },
            pre: [
                {
                    method: controller.patchBlog,
                    assign: "blog"
                }
            ]
        }
    });

    server.route({
        method: "DELETE",
        path: "/blogs/{blog}",
        handler: controller.deleteBlog,
        config: {
            tags: ["api"],
            validate: {
                params: {
                    blog: Joi.string().required()
                }
            }
        }
    });

    return next();
};

exports.register.attributes = {
    name: "blogs"
};
