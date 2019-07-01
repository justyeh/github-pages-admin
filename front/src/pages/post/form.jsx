import React, { Component } from "react";
import { Form, Input, Button, Radio, Spin, Tag } from "antd";

import { postDetail, savePost } from "@/services/post";
import { getTagList } from "@/services/tag";

import MarkdownEditor from "@/components/MarkdownEditor";
import { getQueryVariable } from "@/libs/utils";
import "./post.less";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageLoading: false,
            tagList: [],
            tagSource: [],
            tagSearchValue: "",
            tagSearchVisible: true,
            poster: "",
            markdown: ""
        };
        this.postId = getQueryVariable(this.props.location.search, "id");
        this.editorRef = React.createRef();
    }

    async componentWillMount() {
        if (!this.postId) {
            return;
        }
        this.setState({
            pageLoading: true
        });
        let res = await postDetail(this.postId);
        if (res) {
            this.props.form.setFieldsValue({
                title: res.data.title,
                poster: res.data.poster,
                //allow_comment: !!res.data.allow_comment,
                status: res.data.status
            });
            this.setState({
                tagList: res.data.tagList,
                markdown: res.data.markdown
            });
        }
        this.setState({
            pageLoading: false
        });

        document.addEventListener("click", this.handleDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleDocumentClick);
    }

    isParent(obj, parentObj) {
        while (
            obj !== undefined &&
            obj !== null &&
            obj.tagName.toUpperCase() !== "BODY"
        ) {
            if (obj === parentObj) {
                return true;
            }
            obj = obj.parentNode;
        }
        return false;
    }

    handleDocumentClick = e => {
        let _elSearch = document.querySelector(".tag-search");
        if (
            !this.state.tagSearchVisible ||
            this.isParent(e.target, _elSearch)
        ) {
            return;
        }
        this.setState({
            tagSearchVisible: false
        });
    };

    deleteImage = e => {
        e.stopPropagation();
        this.setState({
            uploadPreview: ""
        });
    };

    handleTagSearch = async e => {
        let value = e.currentTarget.value;
        this.setState({
            tagSearchValue: value
        });

        let tagSource = [];
        let list = await getTagList(value);
        if (
            value &&
            list.filter(item => item.name === value).length === 0 &&
            this.state.tagList.filter(item => item.name === value).length === 0
        ) {
            tagSource.push({
                id: -Date.now(),
                name: `将“${value}”添加到列表中`,
                value: value
            });
        }

        list.forEach(item => {
            if (item.name !== value) {
                tagSource.push(item);
            }
        });
        this.setState({
            tagSearchVisible: true,
            tagSource
        });
    };

    handleTagSelect = async tag => {
        let tagList = this.state.tagList;

        if (tagList.filter(item => item.name === tag.name).length > 0) {
            this.setState({
                tagSearchValue: null
            });
            return;
        }
        tagList.push({
            id: tag.id,
            name: tag.id < 0 ? tag.value : tag.name
        });
        this.setState({
            tagSource: [],
            tagSearchValue: null,
            tagList
        });
    };

    handleTagClose(data) {
        let tagList = this.state.tagList.filter(item => item.id !== data.id);
        this.setState({ tagList });
    }

    handleFormSubmit = () => {
        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return false;
            }
            this.setState({
                pageLoading: true
            });
            let post = values;
            if (this.postId) {
                post.id = this.postId;
            }
            post.markdown = this.editorRef.current.getValue();
            post.tagList = this.state.tagList;
            let res = await savePost(post);
            this.setState({
                pageLoading: false
            });
            if (res) {
                this.props.history.goBack();
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        let Title = getFieldDecorator("title", {
            rules: [
                {
                    required: true,
                    message: "请输入标题"
                }
            ]
        })(<Input autoComplete="off" />);

        let Poster = getFieldDecorator("poster")(<Input autoComplete="off" />);

        /* let Comment = getFieldDecorator("allow_comment", { initialValue: 1 })(
            <RadioGroup>
                <Radio value={1}>开启</Radio>
                <Radio value={0}>关闭</Radio>
            </RadioGroup>
        ); */

        let Status = getFieldDecorator("status", { initialValue: "published" })(
            <RadioGroup>
                <Radio value="published">发布</Radio>
                <Radio value="draft">草稿</Radio>
                <Radio value="offline">下线</Radio>
            </RadioGroup>
        );

        const formItemLayout = {
            labelCol: {
                span: 2
            },
            wrapperCol: {
                span: 20
            }
        };

        let {
            pageLoading,
            tagSource,
            tagList,
            tagSearchValue,
            tagSearchVisible
        } = this.state;

        return (
            <div className="post-form-page">
                <h2 className="page-title container">
                    {!!this.postId ? "Edit" : "Add"} Blog
                </h2>
                <div className="container">
                    <Spin spinning={pageLoading}>
                        <Form {...formItemLayout}>
                            <FormItem label="标题">{Title}</FormItem>
                            <FormItem label="封面">{Poster}</FormItem>
                            <FormItem label="标签">
                                {tagList.map(item => {
                                    return (
                                        <Tag
                                            closable
                                            key={item.id + item.name}
                                            onClose={() =>
                                                this.handleTagClose(item)
                                            }
                                        >
                                            {item.name}
                                        </Tag>
                                    );
                                })}
                                <div className="tag-search">
                                    <Input
                                        value={tagSearchValue}
                                        onChange={this.handleTagSearch}
                                    />

                                    {tagSource.length > 0 && tagSearchVisible && (
                                        <ul>
                                            {tagSource.map(item => (
                                                <li
                                                    key={item.id}
                                                    onClick={() =>
                                                        this.handleTagSelect(
                                                            item
                                                        )
                                                    }
                                                >
                                                    {item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </FormItem>
                            <FormItem label="正文">
                                <MarkdownEditor
                                    value={this.state.markdown}
                                    onSave={this.handleFormSubmit}
                                    ref={this.editorRef}
                                    data={{ postId: this.postId }}
                                />
                            </FormItem>
                            {/* <FormItem label="评论">{Comment}</FormItem> */}
                            <FormItem label="状态">{Status}</FormItem>
                            <FormItem wrapperCol={{ offset: 2 }}>
                                <Button
                                    type="primary"
                                    htmlType="button"
                                    onClick={this.handleFormSubmit}
                                >
                                    保存
                                </Button>
                                <Button
                                    htmlType="button"
                                    onClick={() => {
                                        this.props.history.goBack();
                                    }}
                                >
                                    取消
                                </Button>
                            </FormItem>
                        </Form>
                    </Spin>
                </div>
            </div>
        );
    }
}

const form = Form.create({})(PostForm);

export default form;
