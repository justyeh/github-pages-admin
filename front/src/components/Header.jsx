import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Header extends Component {
    render() {
        return (
            <header className="header">
                <div>
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
