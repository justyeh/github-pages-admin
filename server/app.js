const http = require("http");
const path = require("path");
const fse = require("fs-extra");
const {
    getPostList,
    getPostById,
    savePost,
    deletePost,
    getTagList,
    updateTag,
    deleteTag,
    publishBlog
} = require("./src/services.js");

function Router(req, res) {
    this.request = function(url, fn) {
        if (!url) {
            return new Error("url is required");
        }

        if (url !== req.url.split("?")[0]) {
            return;
        }

        if (req.method !== "GET" && req.method !== "POST") {
            res.end("not supported http method");
            return;
        }

        if (req.method === "GET") {
            let urlSplit = req.url.split("?");
            urlSplit[1] &&
                urlSplit[1].split("&").forEach(item => {
                    let paramsSplit = item.split("=");
                    if (paramsSplit.length === 2) {
                        req.params[paramsSplit[0]] = decodeURIComponent(
                            paramsSplit[1]
                        );
                    }
                });
            fn(req, res);
        }

        if (req.method.toUpperCase() === "POST") {
            let postData = "";
            req.on("data", chunk => {
                postData += chunk;
            });

            req.on("end", () => {
                req.body = JSON.parse(decodeURIComponent(postData));
                fn(req, res);
                publishBlog();
            });
        }
    };
}

http.createServer((handleRouter)).listen(80, () => {
    console.log("Server listening on: http://localhost:%s", 80);
});

function handleRouter(req, res) {
    req.params = {};
    req.body = {};
    req.method = req.method.toUpperCase();
    res.json = jsonData => {
        res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8"
        });
        res.end(JSON.stringify(jsonData));
    };

    const router = new Router(req, res);
    router.request("/", (req, res) => {
        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });
        let html = fse.readFileSync(
            path.resolve(__dirname, "../front/dist/index.html")
        );
        res.end(html);
    });

    router.request("/api/post/list", (req, res) => {
        res.json(getPostList(req.params.status, req.params.keyword));
    });

    router.request("/api/post/detail", (req, res) => {
        res.json(getPostById(Number(req.params.id)));
    });

    router.request("/api/post/save", (req, res) => {
        res.json(savePost(req.body.post));
    });

    router.request("/api/post/delete", (req, res) => {
        res.json(deletePost(Number(req.body.id)));
    });

    router.request("/api/tag/list", (req, res) => {
        res.json(getTagList(req.params.keyword));
    });

    router.request("/api/tag/update", (req, res) => {
        res.json(
            updateTag({
                id: req.body.id,
                name: req.body.name
            })
        );
    });

    router.request("/api/tag/delete", (req, res) => {
        res.json(deleteTag(Number(req.body.id)));
    });
}
