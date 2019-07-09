const path = require("path");
const fse = require("fs-extra");
const express = require("express");
const app = express();
const bodyParser = require('body-parser')  

const {
    getPostList,
    getPostById,
    savePost,
    deletePost,
    getTagList,
    updateTag,
    deleteTag
} = require("./src/services.js");
const { generate } = require("./src/generate");

app.listen(80, () => console.log("Example app listening on port 80!"));

//处理静态文件
app.use(
    "/",
    express.static(path.resolve(__dirname, "../front/build"))
);

//处理post参数
app.use(bodyParser.urlencoded({ extended: false }))    
app.use(bodyParser.json()) 

app.get("/", (req, res) => res.redirect("/post"));

const handleHtml = (req, res) => {
    res.type("html");
    res.send(
        fse.readFileSync(
            path.resolve(__dirname, "../front/build/index.html"),
            "utf8"
        )
    );
};
app.get("/post", handleHtml);
app.get("/post-form", handleHtml);
app.get("/tag", handleHtml);

app.get("/api/post/list", (req, res) => {
    res.json(getPostList(req.query.status, req.query.keyword));
});

app.get("/api/post/detail", (req, res) => {
    res.json(getPostById(Number(req.query.id)));
});

app.post("/api/post/save", (req, res) => {
    res.json(savePost(req.body.post));
});

app.post("/api/post/delete", (req, res) => {
    res.json(deletePost(Number(req.body.id)));
});

app.get("/api/tag/list", (req, res) => {
    res.json(getTagList(req.query.keyword));
});

app.post("/api/tag/update", (req, res) => {
    res.json(
        updateTag({
            id: req.body.id,
            name: req.body.name
        })
    );
});

app.post("/api/tag/delete", (req, res) => {
    res.json(deleteTag(Number(req.body.id)));
});

app.get("/api/generate", async (req, res) => {
    try {
        await generate();
        res.json({ code: 200, data: "", message: "ok" });
    } catch (error) {
        res.json({ code: 201, data: "", message: error });
    }
});
