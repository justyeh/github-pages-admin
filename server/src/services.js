const fse = require("fs-extra");
const path = require("path");

const PostPath = path.resolve(__dirname, "../database/post.json");
const TagPath = path.resolve(__dirname, "../database/tag.json");
const PostTagPath = path.resolve(__dirname, "../database/post_tag.json");

function getPostList(status, keyword) {
    try {
        let postList = fse.readJSONSync(PostPath) || [];
        let postTagList = fse.readJSONSync(PostTagPath) || [];
        let tagList = fse.readJSONSync(TagPath) || [];

        if (status) {
            postList = postList.filter(item => item.status === status);
        }

        if (keyword) {
            postList = postList.filter(
                item =>
                    item.title.toUpperCase().indexOf(keyword.toUpperCase()) > -1
            );
        }

        postList.forEach(post => {
            let postTagIds = postTagList
                .filter(item => item.post_id === post.id)
                .map(item => item.tag_id);

            post.tagList = tagList.filter(item => postTagIds.includes(item.id));
        });

        return { code: 200, data: postList, message: "ok" };
    } catch (error) {
        return { code: 201, data: "", message: error };
    }
}

exports.getPostList = getPostList;

function getPostById(postId) {
    try {
        if (!postId) {
            throw "参数错误或缺失!!";
        }

        let postList = fse.readJSONSync(PostPath) || [];
        let postTagList = fse.readJSONSync(PostTagPath) || [];
        let tagList = fse.readJSONSync(TagPath) || [];

        let post = postList.find(item => item.id === postId);

        if (!post) {
            throw "未找到该Post";
        }

        post.markdown = fse.readFileSync(
            path.resolve(__dirname, `../database/markdown/${postId}.md`),
            "utf8"
        );

        let postTagIds = postTagList
            .filter(item => item.post_id === postId)
            .map(item => item.tag_id);
        post.tagList = tagList.filter(item => postTagIds.includes(item.id));

        return { code: 200, data: post, message: "ok" };
    } catch (error) {
        return { code: 201, data: "", message: error };
    }
}

exports.getPostById = getPostById;

function savePost(postData) {
    try {
        let postList = fse.readJSONSync(PostPath) || [];
        let tagList = fse.readJSONSync(TagPath) || [];
        let postTagList = fse.readJSONSync(PostTagPath) || [];

        let now = Date.now();
        let post = {
            id:
                Number(postData.id) ||
                Math.max(...postList.map(item => item.id)) + 1,
            title: postData.title,
            poster: postData.poster || "",
            status: postData.status,
            created_at: postData.id ? postData.created_at : now,
            updated_at: now
        };

        //更新post.json
        if (!postData.id) {
            postList.unshift(post);
        } else {
            let index = postList.findIndex(item => item.id === post.id);
            if (index < 0) {
                throw "未找到该Post";
            } else {
                postList.splice(index, 1, post);
            }
        }

        //解除原始post_tag关联
        postTagList = postTagList.filter(item => item.post_id !== post.id);

        let existTags = [];
        let newTags = [];
        postData.tagList.length > 0 &&
            postData.tagList.forEach(item => {
                if (Number(item.id) < 0) {
                    newTags.push(item);
                } else {
                    existTags.push(item);
                }
            });

        if (existTags.length > 0) {
            let insertPostTagId =
                Math.max(...postTagList.map(item => item.id)) + 1;

            existTags.forEach((tag, index) => {
                postTagList.push({
                    id: insertPostTagId + index,
                    post_id: post.id,
                    tag_id: tag.id
                });
            });
        }

        if (newTags.length > 0) {
            let insertTagId = Math.max(...tagList.map(item => item.id)) + 1;
            let insertPostTagId =
                Math.max(...postTagList.map(item => item.id)) + 1;
            newTags.forEach((tag, index) => {
                tagList.push({
                    id: insertTagId + index,
                    name: tag.name
                });
                postTagList.push({
                    id: insertPostTagId + index,
                    post_id: post.id,
                    tag_id: insertTagId + index
                });
            });
        }

        fse.outputFileSync(
            path.resolve(__dirname, `../database/markdown/${post.id}.md`),
            postData.markdown
        );
        fse.outputJSONSync(PostPath, postList);
        fse.outputJSONSync(TagPath, tagList);
        fse.outputJSONSync(PostTagPath, postTagList);

        return { code: 200, data: "", message: "ok" };
    } catch (error) {
        return { code: 201, data: "", message: error };
    }
}

exports.savePost = savePost;

function deletePost(postId) {
    try {
        if (!postId) {
            throw "参数错误或缺失!!";
        }

        let postList = fse.readJSONSync(PostPath) || [];
        let postTagList = fse.readJSONSync(PostTagPath) || [];

        postList = postList.filter(item => item.id !== postId);
        postTagList = postTagList.filter(item => item.post_id !== postId);

        fse.outputJSONSync(PostPath, postList);
        fse.outputJSONSync(PostTagPath, postTagList);

        return { code: 200, data: "", message: "ok" };
    } catch (error) {
        console.log(error);
        return { code: 201, data: "", message: error };
    }
}

exports.deletePost = deletePost;

function getTagList(keyword) {
    try {
        let postList = fse.readJSONSync(PostPath) || [];
        let postTagList = fse.readJSONSync(PostTagPath) || [];
        let tagList = fse.readJSONSync(TagPath) || [];

        if (keyword) {
            tagList = tagList.filter(
                item =>
                    item.name.toUpperCase().indexOf(keyword.toUpperCase()) > -1
            );
        }

        tagList.forEach(tag => {
            let tagRelevancePostIds = postTagList
                .filter(item => item.tag_id === tag.id)
                .map(item => item.post_id);
            tag.postList = postList.filter(item =>
                tagRelevancePostIds.includes(item.id)
            );
        });

        return { code: 200, data: tagList, message: "ok" };
    } catch (error) {
        return { code: 201, data: "", message: error };
    }
}

exports.getTagList = getTagList;

function updateTag(tag) {
    try {
        if (!tag.id || !tag.name) {
            throw "参数错误或缺失!!";
        }
        let tagList = fse.readJSONSync(TagPath) || [];
        for (let i = 0; i < tagList.length; i++) {
            if (tagList[i].id === tag.id) {
                tagList[i].name = tag.name;
                break;
            }
        }
        fse.outputJSONSync(TagPath, tagList);

        return { code: 200, data: "", message: "ok" };
    } catch (error) {
        return { code: 201, data: "", message: error };
    }
}

exports.updateTag = updateTag;

function deleteTag(tagId) {
    try {
        if (!tagId) {
            throw "参数错误或缺失!!";
        }
        let tagList = fse.readJSONSync(TagPath) || [];
        let postTagList = fse.readJSONSync(PostTagPath) || [];
        tagList = tagList.filter(item => item.id !== tagId);
        postTagList = postTagList.filter(item => item.tag_id !== tagId);

        fse.outputJSONSync(TagPath, tagList);
        fse.outputJSONSync(PostTagPath, postTagList);

        return { code: 200, data: "", message: "ok" };
    } catch (error) {
        return { code: 201, data: "", message: error };
    }
}

exports.deleteTag = deleteTag;

function publishBlog() {
    let postList = fse.readJSONSync(PostPath) || [];
    let postTagList = fse.readJSONSync(PostTagPath) || [];
    let tagList = fse.readJSONSync(TagPath) || [];
}
exports.publishBlog = publishBlog;
