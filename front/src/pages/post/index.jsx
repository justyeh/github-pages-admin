import React, { Component } from "react";
import { Table, Tag, Input, Button, Modal } from "antd";
import Tab from "@/components/Tab";
import { getQueryVariable } from "@/libs/utils";

import { getPostList, deletePost } from "@/services/post";

import "./post.less";

const confirm = Modal.confirm;
const Search = Input.Search;

const tabList = [
    { value: "published", label: "已发布" },
    { value: "draft", label: "草稿" },
    { value: "offline", label: "被下线" }
];

export default class Post extends Component {
    constructor(props) {
        super();
        let search = props.location.search;
        let keyword = getQueryVariable(search, "keyword");
        let status = getQueryVariable(search, "status") || tabList[0].value;
        this.state = {
            status,
            keyword,
            postList: [],
            tableLoading: false
        };
        this.postColumns = [
            {
                title: "图片",
                dataIndex: "poster",
                align: "center",
                render: (poster, record) =>
                    poster ? (
                        <img
                            src={`https://justyeh.github.io/post/${record.id}/image/${poster}`}
                            className="poster"
                            alt="poster"
                        />
                    ) : (
                        <div className="poster" />
                    )
            },
            {
                title: "标题",
                dataIndex: "title",
                align: "left",
                render: (text, record) => (
                    <a
                        href={`http://www.justyeh.top/post/${record.id}`}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {text}
                    </a>
                )
            },
            {
                title: "标签",
                dataIndex: "tagList",
                align: "center",
                render: tagList => (
                    <div>
                        {tagList.map(tag => {
                            return <Tag key={tag.id}>{tag.name}</Tag>;
                        })}
                    </div>
                )
            },
            {
                title: "操作",
                dataIndex: "handle",
                width: 100,
                fixed: "right",
                align: "center",
                render: (text, record, index) => {
                    return (
                        <div className="handle">
                            <button onClick={() => this.deletePost(index)}>
                                删除
                            </button>
                            <button onClick={() => this.editPost(record.id)}>
                                编辑
                            </button>
                        </div>
                    );
                }
            }
        ];
    }

    componentWillMount() {
        this.getPostList();
    }

    handleTabClick = val => {
        this.setState(
            {
                status: val,
                keyword: ""
            },
            this.getPostList
        );
    };

    getPostList = async () => {
        this.setState({
            tableLoading: true
        });
        let { status, keyword } = this.state;
        this.props.history.push(`/post?status=${status}&keyword=${keyword}`);
        this.setState({
            postList: await getPostList(status, keyword),
            tableLoading: false
        });
    };

    addPost = () => {
        let { keyword, status } = this.state;
        this.props.history.replace(`/post?keyword=${keyword}&status=${status}`);
        this.props.history.push("/post-form");
    };

    editPost = id => {
        let { keyword, status } = this.state;
        this.props.history.replace(`/post?keyword=${keyword}&status=${status}`);
        this.props.history.push(`/post-form?id=${id}`);
    };

    deletePost = index => {
        confirm({
            title: "确定删除该文章吗？",
            onOk: async () => {
                if (await deletePost(this.state.postList[index].id)) {
                    this.setState({
                        postList: this.state.postList.filter(
                            (item, itemIndex) => itemIndex !== index
                        )
                    });
                }
            }
        });
    };

    render() {
        return (
            <div className="post-list">
                <Tab
                    tabs={tabList}
                    value={this.state.status}
                    onTabClick={tabData => this.handleTabClick(tabData)}
                />
                <div className="container filter">
                    <Search
                        placeholder="input search text"
                        enterButton="搜索"
                        className="search"
                        value={this.state.keyword}
                        onChange={e =>
                            this.setState({ keyword: e.target.value })
                        }
                        onSearch={this.getPostList}
                    />
                    <Button type="primary" onClick={this.addPost}>
                        新增
                    </Button>
                </div>
                <h2 className="page-title container">博客列表</h2>
                <div className="container">
                    <Table
                        rowKey={record => record.id}
                        dataSource={this.state.postList}
                        columns={this.postColumns}
                        loading={this.state.tableLoading}
                        scroll={{ x: 1000 }}
                    />
                </div>
            </div>
        );
    }
}
