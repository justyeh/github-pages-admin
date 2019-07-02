import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { generate } from "@/services/index";

class Header extends Component {
    handleGenerate = () => {
        generate();
    };
    render() {
        return (
            <header className="header">
                <div>
                    <span className="link" onClick={this.handleGenerate}>静态化</span>
                    <a
                        href="https://justyeh.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        访问前台
                    </a>
                </div>
            </header>
        );
    }
}

export default withRouter(Header);
