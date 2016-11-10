import { Server, Response } from "hapi";
import * as Joi from "joi";

import { PostsController } from "../controllers/PostsController";
import { Models } from "savitri-shared";
import { ServerPlugins } from "../plugins";

export interface Params {
    blogSlug?: string;
    postSlug?: string;
}

export interface Query {
    tag?: string;
    page?: number;
}

export interface PreParams {
    posts?: Models.Post[];
    post?: Models.Post;
    blog?: any;
    slug?: string;
}

export interface PreResponses {
    post: Response;
    posts: Response;
}

exports.register = (server: Server, options: any, next: Function) => {

    const controller = new PostsController();

    server.dependency("knex", (server: Server, next: Function) => {

        controller.init((<ServerPlugins>server.plugins).knex.pg, Models.Post.table);

        return next();
    });

    server.route({
        method: "GET",
        path: "/blogs/{blogSlug}/posts",
        handler: controller.returnPosts,
        config: {
            tags: ["api"],
            validate: {
                params: {
                    blogSlug: Joi.string().required()
                },
                query: {
                    tag: Joi.string(),
                    page: Joi.string()
                }
            },
            pre: [
                {
                    method: controller.retrieveBlog,
                    assign: "blog"
                },
                {
                    method: controller.retrievePosts,
                    assign: "posts"
                }
            ]
        }
    });

    server.route({
        method: "POST",
        path: "/blogs/{blogSlug}/posts",
        handler: controller.returnPost,
        config: {
            tags: ["api"],
            validate: {
                params: {
                    blogSlug: Joi.string().required()
                },
                payload: Models.Post.schema
            },
            pre: [
                {
                    method: controller.retrieveBlog,
                    assign: "blog"
                },
                {
                    method: controller.getSlug,
                    assign: "slug"
                },
                {
                    method: controller.insertPost,
                    assign: "post"
                },
            ]
        }
    });

    server.route({
        method: "GET",
        path: "/blogs/{blogSlug}/posts/{postSlug}",
        handler: controller.returnPost,
        config: {
            tags: ["api"],
            validate: {
                params: {
                    blogSlug: Joi.string().required(),
                    postSlug: Joi.string().required()
                }
            },
            pre: [
                {
                    method: controller.retrieveBlog,
                    assign: "blog"
                },
                {
                    method: controller.retrievePost,
                    assign: "post"
                }
            ]
        }
    });

    server.route({
        method: "PATCH",
        path: "/blogs/{blogSlug}/posts/{postSlug}",
        handler: controller.returnPost,
        config: {
            tags: ["api"],
            validate: {
                params: {
                    blogSlug: Joi.string().required(),
                    postSlug: Joi.string().required()
                },
                payload: Models.Post.schema
            },
            pre: [
                {
                    method: controller.retrieveBlog,
                    assign: "blog"
                },
                {
                    method: controller.patchPost,
                    assign: "post"
                }
            ]
        }
    });

    server.route({
        method: "DELETE",
        path: "/blogs/{blogSlug}/posts/{postSlug}",
        handler: controller.deletePost,
        config: {
            tags: ["api"],
            validate: {
                params: {
                    blogSlug: Joi.string().required(),
                    postSlug: Joi.string().required()
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

    // server.route({
    //     method: "GET",
    //     path: "/blogs/{blogSlug}/series",
    //     handler: controller.handleGetSeriesList,
    //     config: {
    //         tags: ["api"],
    //         validate: {
    //             params: {
    //                 blogSlug: Joi.string().required()
    //             }
    //         }
    //     }
    // });

    return next();
};

exports.register.attributes = {
    name: "posts"
};
