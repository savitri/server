import { Request, IReply } from "hapi";
import * as Boom from "boom";
import { Models } from "savitri-shared";

import { BaseController } from "./BaseController";
import { Params, Query, PreParams, PreResponses } from "../routes/posts";

export const POSTS_PER_PAGE = 20;

export class PostsController extends BaseController {
    returnPost = (request: Request, reply: IReply) => {

        const preParams: PreParams = request.pre;
        const preResponses: PreResponses = request.preResponses;

        if (preResponses.post.statusCode === 404) {

            const error = {
                errors: [Boom.notFound("Blog not found").output.payload],
                url: request.url.path
            };

            return reply(error).code(404);
        }
        else if (!preParams.post) {

            const error = {
                errors: [Boom.notFound("Post not found").output.payload],
                url: request.url.path
            };

            return reply(error).code(404);
        }

        const blog = {
            data: preParams.post,
            url: request.url.path
        };

        return reply(blog).code(preResponses.post.statusCode);
    }

    returnPosts = (request: Request, reply: IReply) => {

        const preParams: PreParams = request.pre;
        const preResponses: PreResponses = request.preResponses;

        if (preResponses.posts.statusCode === 404) {

            const error = {
                errors: [Boom.notFound("Blog not found").output.payload],
                url: request.url.path
            };

            return reply(error).code(404);
        }
        else {

            const blogs = {
                data: preParams.posts,
                url: request.url.path
            };

            return reply(blogs);
        }
    }

    retrievePosts = (request: Request, reply: IReply) => {

        const queryParams: Query = request.query;
        const preParams: PreParams = request.pre;

        const blog = preParams.blog;

        if (blog) {

            let query = this.table()
                .where({
                    blog_id: blog.id,
                    status: "published"
                });

            if (queryParams.tag) {

                // query = query.where()
            }

            if (queryParams.page && queryParams.page > 0) {

                query = query.offset((queryParams.page - 1) * POSTS_PER_PAGE);
            }

            return reply(query.select("*").limit(POSTS_PER_PAGE).orderBy("published_at", "desc"));
        }
        else {

            return reply({}).code(404);
        }
    }

    retrieveBlog = (request: Request, reply: IReply) => {

        const params: Params = request.params;

        const query = this.pg
            .from(Models.Blog.table)
            .where({ slug: params.blogSlug })
            .first("id");

        return reply(query);
    }

    retrievePost = (request: Request, reply: IReply) => {

        const params: Params = request.params;
        const preParams: PreParams = request.pre;

        const blog = preParams.blog;

        if (blog) {

            const query = this.table()
                .where({
                    blog_id: blog.id,
                    slug: params.postSlug
                })
                .first();

            return reply(query);
        }
        else {

            return reply({}).code(404);
        }
    }

    getSlug = (request: Request, reply: IReply) => {

        const preParams: PreParams = request.pre;

        if (!preParams.blog) {

            return reply({}).code(404);
        }

        const post = new Models.Post(request.payload, false);

        this.table()
            .select("slug")
            .where({
                blog_id: post.model.blog_id
            })
            .andWhere("slug", "like", `${post.slug}%`)
            .orderBy("number", "desc")
            .then((results: Models.IPost[]) => {

                // return with generated slug if new record
                if (!results.length) {

                    return reply(post.slug);
                }

                // use this pattern to search for post slugs
                const slugRegex = new RegExp(`^${post.slug}(?:-\\d*)?$`);

                // track if an existing post has the generated slug 
                let exactMatch = false;

                const matchingSlugs = results.filter(result => {

                    if (result.slug === post.slug) {

                        exactMatch = true;
                        return true;
                    }

                    const match = result.slug.match(slugRegex);

                    return match && match.length !== 0 ? true : false;
                });

                // if no prior matching slug return with default
                if (!matchingSlugs.length && !exactMatch) {

                    return reply(post.slug);
                }

                // sort slugs according to slug-{number} asc
                const sortedSlugs = matchingSlugs.map(match => match.slug).sort((a, b) => {

                    return parseInt(a.substr(a.lastIndexOf("-") + 1)) > parseInt(b.substr(b.lastIndexOf("-") + 1)) ? 1 : 0;
                });

                const excludeDefaultSlug = sortedSlugs.slice(0, sortedSlugs.indexOf(post.slug))
                    .concat(sortedSlugs.slice(sortedSlugs.indexOf(post.slug) + 1));

                const lastSlug = excludeDefaultSlug.pop();

                // get number of last slug and add 1
                let slug: string;

                if (lastSlug) {

                    const lastIndex = parseInt(lastSlug.substr(lastSlug.lastIndexOf("-") + 1));

                    if (isNaN(lastIndex)) {

                        slug = post.slug + "-1";
                    }
                    else {

                        slug = post.slug + "-" + (lastIndex + 1);
                    }
                }
                else {

                    slug = post.slug + "-1";
                }

                return reply(slug);
            });
    }

    insertPost = (request: Request, reply: IReply) => {

        const preParams: PreParams = request.pre;

        const post = new Models.Post(request.payload, false);

        if (preParams.slug) {

            post.model.slug = preParams.slug;
        }

        this.table()
            .insert(post.model, "*")
            .then(results => reply(results[0]).code(201));
    }

    patchPost = (request: Request, reply: IReply) => {

        const params: Params = request.params;
        const preParams: PreParams = request.pre;

        const blog = preParams.blog;

        if (blog) {

            this.table()
                .update(request.payload, "*")
                .where({
                    blog_id: blog.id,
                    slug: params.postSlug
                })
                .then(results => reply(results[0]));
        }
        else {

            return reply({}).code(404);
        }
    }

    deletePost = (request: Request, reply: IReply) => {

        const params: Params = request.params;
        const preParams: PreParams = request.pre;

        const blog = preParams.blog;

        if (blog) {

            this.table()
                .where({
                    blog_id: blog.id,
                    slug: params.postSlug
                })
                .update({
                    status: "deleted",
                    deleted_at: new Date()
                })
                .then(results => {

                    if (!results) {

                        const error = {
                            errors: [Boom.notFound("Post not found").output.payload],
                            url: request.url.path
                        };

                        return reply(error).code(404);
                    }

                    return reply({});
                });
        }
        else {

            const error = {
                errors: [Boom.notFound("Blog not found").output.payload],
                url: request.url.path
            };

            return reply(error).code(404);
        }
    }

    // handleGetSeriesList = (request: Request, reply: IReply) => {

    //     const params: Params = request.params;

    //     this.dbCollection.aggregate([
    //         { $match: { blogSlug: params.blogSlug, "tags.seriesTag": true } },
    //         { $unwind: "$tags" },
    //         { $match: { "tags.seriesTag": true } },
    //         { $project: { series: "$tags", _id: 0 } }
    //     ])
    //         .toArray()
    //         .then((results: { series: Tag }[]) => results.map(result => new Tag(result.series)))
    //         .then(series => reply(series))
    //         .catch(err => reply(err));
    // }
}
