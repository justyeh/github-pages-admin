import React, { Component } from "react";
import { Table, Divider, Icon, Modal, Input } from "antd";
import { getTagList, deleteTag, updateTag } from "@/services/tag";
import { getQueryVariable } from "@/libs/utils";
import TagDialog from "./dialog";

const confirm = Modal.confirm;
const Search = Input.Search;

export default class Tag extends Component {
    constructor(props) {
        super();
        let search = props.location.search;
        let keyword = getQueryVariable(search, "keyword");
        this.state = {
            keyword,
            tagList: [],
            tableLoading: false,
            dialogVisible: false,
            tagForm: {}
        };

        this.tagColumns = [
            {
                title: "名称",
                dataIndex: "name",
                align: "center"
            },
            {
                title: "关联的文章",
                dataIndex: "postList",
                align: "left",
                render: postList => {
                    return (
                        <div className="post-list">
                            {postList.length === 0 ? (
                                <Icon
                                    type="frown"
                                    className="empty"
                                    title="empty"
                                    style={{ color: "#999", fontSize: " 20px" }}
                                />
                            ) : (
                                postList.map(item => (
                                    <div key={item.id}>
                                        <a
                                            href={`http://www.justyeh.top/post/${
                                                item.id
                                            }`}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            {item.title}
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>
                    );
                }
            },
            {
                title: "操作",
                dataIndex: "handle",
                width: 120,
                fixed: "right",
                align: "center",
                render: (text, record, index) => {
                    return (
                        <div className="handle">
                            <button onClick={() => this.editTag(index)}>
                                编辑
                            </button>
                            <Divider type="vertical" />
                            <button onClick={() => this.deleteTag(index)}>
                                删除
                            </button>
                        </div>
                    );
                }
            }
        ];
    }

    componentWillMount() {
        this.getTagList();
    }

    getTagList = async () => {
        this.setState({
            tableLoading: true
        });
        this.props.history.push(`/tag?keyword=${this.state.keyword}`);

        let tagList = await getTagList(this.state.keyword);
        tagList.forEach(item => (item.editable = false));
        this.setState({
            tagList,
            tableLoading: false
        });
    };

    editTag = index => {
        let tag = this.state.tagList[index];
        this.setState({
            dialogVisible: true,
            tagForm: {
                id: tag.id,
                name: tag.name,
                index
            }
        });
    };

    updateTagOk = async values => {
        let { id, index } = this.state.tagForm;
        console.log(await updateTag(id, values.name));
        if (await updateTag(id, values.name)) {
            let tagList = this.state.tagList;
            tagList[index].name = values.name;
            this.setState({
                dialogVisible: false,
                tagList
            });
        }
    };

    deleteTag = index => {
        confirm({
            title: "确认删除该条数据？",
            onOk: async () => {
                if (await deleteTag(this.state.tagList[index].id)) {
                    this.setState({
                        tagList: this.state.tagList.filter(
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
                <div className="container filter">
                    <Search
                        placeholder="input search text"
                        enterButton="搜索"
                        className="search"
                        value={this.state.keyword}
                        onChange={e =>
                            this.setState({ keyword: e.target.value })
                        }
                        onSearch={this.getTagList}
                    />
                </div>

                <h2 className="page-title container">标签列表</h2>
                <div className="container">
                    <Table
                        rowKey={record => record.id}
                        dataSource={this.state.tagList}
                        columns={this.tagColumns}
                        loading={this.state.tableLoading}
                        scroll={{ x: 1000 }}
                    />
                </div>
                {this.state.dialogVisible && (
                    <TagDialog
                        visible={this.state.dialogVisible}
                        name={this.state.tagForm.name}
                        onOk={this.updateTagOk}
                        onCancel={() => {
                            this.setState({
                                dialogVisible: false
                            });
                        }}
                    />
                )}
            </div>
        );
    }
}
