import React, { Component } from "react";
import { Pagination } from "antd";
import PropTypes from "prop-types";
import styles from "@/assets/less/page.module.less";

export default class Page extends Component {
    static propTypes = {
        pageIndex: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        onChange: PropTypes.func
    };

    render() {
        return (
            <div className={styles.page}>
                <Pagination
                    showSizeChanger
                    current={this.props.pageIndex}
                    pageSize={this.props.pageSize}
                    total={this.props.total}
                    pageSizeOptions={["15", "30", "100"]}
                    onShowSizeChange={(current, size) =>
                        this.props.onChange(1, size)
                    }
                    onChange={(page, pageSize) => {
                        this.props.onChange(page, pageSize);
                    }}
                />
            </div>
        );
    }
}
