import React, { Component } from "react";
import { Icon } from "antd";
import marked from "marked";
import hljs from "highlight.js";
import PropTypes from "prop-types";
import "@/assets/less/MarkdownEditor.less";

import CodeMirror from "codemirror";
import "codemirror/mode/markdown/markdown";

const BLOG_URL = "https://justyeh.github.io";

export default class MarkdownEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            preview: false,
            fullscreen: false,
            sideMode: false,
            markdownContent: ""
        };
        this.editorRef = React.createRef();
    }

    componentWillMount() {
        let { postId } = this.props.data;
        this.rendererMD = new marked.Renderer();
        this.rendererMD.image = function(href, title, text) {
            if (href.startsWith("http")) {
                return `<img src="href" alt="${text || ""}" />`;
            } else {
                return `<img src="${BLOG_URL}/static/blog/${postId}/${href}" alt="${text ||
                    ""}" />`;
            }
        };
        this.rendererMD.link = function(href, title, text) {
            if (href.startsWith("http")) {
                return `<a href="${href}" title="${title ||
                    ""}" target="_blank">${text}</a>`;
            } else {
                return `<a href="${BLOG_URL}/static/blog/${postId}/${href}" title="${title ||
                    ""}" target="_blank">${text}</a>`;
            }
        };

        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function(code) {
                return hljs.highlightAuto(code).value;
            }
        });
        window.addEventListener("keydown", this.onKeyDown, false);
    }

    componentDidMount() {
        this._html = document.querySelector(".html");
        this._md = document.querySelector(".html .md");
        this.editor = CodeMirror.fromTextArea(this.editorRef.current, {
            mode: "markdown",
            theme: "paper",
            height: 500,
            lineWrapping: true
        });
        this.editor.on("change", this.handleChange);
        this.editor.on("scroll", () => this.handleScroll("editor"));
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
    }

    componentWillReceiveProps(nextProps) {
        if (this.receivedValue || !nextProps.value) {
            return false;
        }
        this.receivedValue = true;
        this.editor.setValue(nextProps.value);
    }

    onKeyDown = e => {
        if (e.key === "Escape" && this.state.fullscreen) {
            this.setState({
                fullscreen: false
            });
        }
        if (e.key.toLowerCase() === "s" && e.ctrlKey) {
            e.preventDefault();
            if (typeof this.props.onSave === "function") {
                this.props.onSave();
            }
        }
    };

    togglePreview = () => {
        let { preview, sideMode } = this.state;
        if (sideMode) {
            sideMode = false;
        }
        this.setState({
            preview: !preview,
            sideMode,
            markdownContent: this.editor.getValue()
        });
    };

    toggleFullscreen = () => {
        this.setState({
            fullscreen: !this.state.fullscreen
        });
    };

    toggleSideMode = () => {
        let { preview, sideMode } = this.state;
        if (preview) {
            preview = false;
        }
        this.setState(
            {
                preview,
                sideMode: !sideMode,
                markdownContent: this.editor.getValue()
            },
            () => {
                if (this.state.sideMode) {
                    this.handleScroll("editor");
                }
            }
        );
    };

    handleChange = val => {
        if (this.state.preview || this.state.sideMode) {
            this.setState({
                markdownContent: val.getValue()
            });
        }
    };

    //双向的滚动支持
    handleScroll = target => {
        if (!this.state.sideMode) {
            return;
        }
        if (target === "editor" && !this.editorScrollLoack) {
            this.htmlScollLock = true;
            this._html.scrollTop =
                this._md.clientHeight *
                (this.editor.doc.scrollTop / this.editor.doc.height);

            let timer = setTimeout(() => {
                this.htmlScollLock = false;
                clearTimeout(timer);
            }, 200);
        }

        if (target === "html" && !this.htmlScollLock) {
            this.editorScrollLoack = true;
            let scrollToP =
                this.editor.doc.height *
                (this._html.scrollTop / this._md.clientHeight);
            this.editor.scrollTo(this.editor.doc.scrollLeft, scrollToP);

            let timer = setTimeout(() => {
                this.editorScrollLoack = false;
                clearTimeout(timer);
            }, 200);
        }
    };

    getValue = () => {
        return this.editor.getValue();
    };

    render() {
        let { preview, fullscreen, sideMode, markdownContent } = this.state;
        let markdownClass = ["markdown"];
        preview && markdownClass.push("preview");
        fullscreen && markdownClass.push("fullscreen");
        sideMode && markdownClass.push("side-mode");

        return (
            <div className={markdownClass.join(" ")}>
                <div
                    className={`${
                        preview || fullscreen || sideMode ? "active " : ""
                    }tabbar`}
                >
                    <div
                        title="预览"
                        className={preview ? "border" : ""}
                        onClick={this.togglePreview}
                    >
                        <Icon type="eye" />
                    </div>
                    <div
                        title={fullscreen ? "退出全屏" : "全屏"}
                        className={fullscreen ? "border" : ""}
                        onClick={this.toggleFullscreen}
                    >
                        <Icon
                            type={fullscreen ? "fullscreen-exit" : "fullscreen"}
                        />
                    </div>
                    <div
                        title="边写边看"
                        className={sideMode ? "border" : ""}
                        onClick={this.toggleSideMode}
                    >
                        <Icon type="minus-square" rotate={90} />
                    </div>
                </div>
                <div className="box">
                    <div className="editor">
                        <textarea id="code" ref={this.editorRef} />
                    </div>
                    <div
                        className="html"
                        onScroll={() => this.handleScroll("html")}
                    >
                        <div
                            className="md"
                            dangerouslySetInnerHTML={{
                                __html: marked(markdownContent, {
                                    renderer: this.rendererMD
                                })
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

MarkdownEditor.propTypes = {
    value: PropTypes.string.isRequired,
    data: PropTypes.object,
    onSave: PropTypes.func
};

MarkdownEditor.defaultProps = {
    value: "",
    data: {}
};
