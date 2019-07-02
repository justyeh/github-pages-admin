const fse = require("fs-extra");
const path = require("path");
const marked = require("marked");
const Vue = require("vue");
const VueServerRenderer = require("vue-server-renderer");
const helper = require("./helper");
const BLOG_URL = "https://justyeh.github.io";

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true
});

function getMarkedRender(postId) {
    let renderer = new marked.Renderer();
    renderer.image = function(href, title, text) {
        if (href.startsWith("http")) {
            return `<img src="href" alt="${text || ""}" />`;
        } else {
            return `<img src="${BLOG_URL}/static/blog/${postId}/${href}" alt="${text ||
                ""}" />`;
        }
    };
    renderer.link = function(href, title, text) {
        if (href.startsWith("http")) {
            return `<a href="${href}" title="${title || ""}" target="_blank">${text}</a>`;
        } else {
            return `<a href="${BLOG_URL}/static/blog/${postId}/${href}" title="${title ||
                ""}" target="_blank">${text}</a>`;
        }
    };
    return renderer;
}

let STORE = {};

function initStore() {
    STORE = {
        post: fse.readJSONSync(
            path.resolve(__dirname, "../database/post.json")
        ),
        tag: fse.readJSONSync(path.resolve(__dirname, "../database/tag.json")),
        post_tag: fse.readJSONSync(
            path.resolve(__dirname, "../database/post_tag.json")
        )
    };
}

const renderer = VueServerRenderer.createRenderer({
    template: fse.readFileSync("./template/index.template.html", "utf8")
});

const App_Page = new Vue({
    template: fse.readFileSync("./template/page.html", "utf8"),
    data: {
        postList: [],
        pager: ""
    }
});

const App_Post = new Vue({
    template: fse.readFileSync("./template/post.html", "utf8"),
    data: {
        id: "",
        title: "",
        poster: "",
        updatedAt: "",
        tagList: "",
        content: ""
    }
});

const App_Tag = new Vue({
    template: fse.readFileSync("./template/tag.html", "utf8"),
    data: {
        id: "",
        name: "",
        postList: []
    }
});

function getPostDetail(postId) {
    let tagIds = STORE.post_tag
        .filter(item => item.post_id === postId)
        .map(item => item.id);
    let tagList = STORE.tag.filter(item => {
        return tagIds.indexOf(item.id) > -1;
    });
    let content = marked(
        fse.readFileSync(`./database/markdown/${postId}.md`, "utf-8"),
        { renderer: getMarkedRender(postId) }
    );

    let post = STORE.post.find(item => item.id === postId);

    return {
        id: postId,
        title: post.title,
        poster: post.poster,
        summary: content.replace(/<[^>]+>/g, "").slice(0, 200),
        content,
        tagList,
        updated_at: helper.timeago(post.updated_at)
    };
}

async function generateHtml() {
    fse.emptyDirSync("./dist");

    //create page html
    let publishedPost = STORE.post.filter(item => item.status === "published");
    let pageSize = 15;
    let page = Math.ceil(publishedPost.length / pageSize);
    for (let index = 0; index < page; index++) {
        let postIds = publishedPost
            .slice(index * pageSize, (index + 1) * pageSize)
            .map(item => item.id);

        App_Page.postList = postIds.map(id => {
            return getPostDetail(id);
        });
        App_Page.pager = helper.createPageHtml(
            index + 1,
            publishedPost.length,
            pageSize
        );

        let html = await renderer.renderToString(App_Page, {
            title: "justyeh的前端博客",
            description: "justyeh的前端博客",
            keywords: "justyeh的前端博客"
        });

        if (index === 0) {
            fse.outputFileSync(`./dist/index.html`, html);
        }

        fse.outputFileSync(`./dist/page/${index + 1}/index.html`, html);
    }

    //create post html
    STORE.post.forEach(async postItem => {
        let post = getPostDetail(postItem.id);
        let tagStr = post.tagList.map(item => item.name).join("，");

        App_Post.id = post.id;
        App_Post.title = post.title;
        App_Post.poster = post.poster || "";
        App_Post.updated_at = post.updated_at;
        App_Post.tagList = post.tagList;
        App_Post.content = post.content;

        let html = await renderer.renderToString(App_Post, {
            title: postItem.title,
            description: tagStr,
            keywords: tagStr
        });
        fse.outputFileSync(`./dist/post/${postItem.id}/index.html`, html);
    });

    //create tag html
    STORE.tag.forEach(async tagItem => {
        let postIds = STORE.post_tag
            .filter(item => item.tag_id === tagItem.id)
            .map(item => item.post_id);

        App_Tag.id = tagItem.id;
        App_Tag.name = tagItem.name;
        App_Tag.postList = postIds.map(item => {
            return getPostDetail(item);
        });

        let seoText = `"${tagItem.name}相关文章"`;

        let html = await renderer.renderToString(App_Tag, {
            title: seoText,
            description: seoText,
            keywords: seoText
        });
        fse.outputFileSync(`./dist/tag/${tagItem.id}/index.html`, html);
    });
}

function generateSitemap() {
    let sitemap = `${BLOG_URL}\n`;

    let publishedPost = STORE.post.filter(item => item.status === "published");
    let pageSize = 15;
    let page = Math.ceil(publishedPost.length / pageSize);
    for (let index = 0; index < page; index++) {
        sitemap += `${BLOG_URL}/page/${index + 1}\n`;
    }

    STORE.post.forEach(item => {
        sitemap += `${BLOG_URL}/post/${item.id}\n`;
    });

    STORE.tag.forEach(item => {
        sitemap += `${BLOG_URL}/tag/${item.id}\n`;
    });
    fse.outputFileSync("./dist/sitemap.txt", sitemap);
}

function copy2GithubPages() {
    let targetPath = path.resolve(__dirname, "../../../justyeh.github.io/");
    fse.emptyDirSync(path.resolve(__dirname, targetPath, "./page"));
    fse.emptyDirSync(path.resolve(__dirname, targetPath, "./post"));
    fse.emptyDirSync(path.resolve(__dirname, targetPath, "./tag"));
    fse.copySync("./dist/", targetPath);
}

async function generate() {
    initStore();
    await generateHtml();
    await generateSitemap();
    copy2GithubPages();
}

exports.generate = generate;
