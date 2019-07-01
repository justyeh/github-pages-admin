import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";

import FullpageLayout from "@/layout/Fullpage";
import ManagerLayout from "@/layout/Manage";

class AuthRouter extends Component {
    render() {
        const { component: Component, ...rest } = this.props;
        const layout = rest.layout;

        //设置页面的title
        document.title = rest.meta.title;
        if (layout === "fullpage") {
            return (
                <FullpageLayout>
                    <Route {...rest} exact component={Component} />{" "}
                </FullpageLayout>
            );
        } else {
            return (
                <ManagerLayout>
                    <Route {...rest} exact component={Component} />{" "}
                </ManagerLayout>
            );
        }
    }
}
export default withRouter(AuthRouter);
