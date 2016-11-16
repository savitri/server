import { Models } from "savitri-shared";

export const newPost: Models.IPost = {
    blog_id: 1,
    author_id: 1,
    slug: "default-slug",
    title: "The post title",
    txt: "New text",
    script: "ro",
    created_at: new Date().toString(),
    status: "draft"
};

export const existingPost = {
    blog_id: 1,
    author_id: 1,
    slug: "the-post-title",
    title: "The post title",
    txt: "New text",
    script: "ro",
    created_at: new Date().toString(),
    status: "draft"
};
