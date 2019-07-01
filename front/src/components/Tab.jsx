import React, { Component } from "react";
import styles from "@/assets/less/tab.module.less";
import PropTypes from "prop-types";

export default class Tab extends Component {
    static propTypes = {
        tabs: PropTypes.array.isRequired,
        onTabClick: PropTypes.func
    };

    render() {
        return (
            <div className={styles.tab}>
                {this.props.tabs.map(item => {
                    return (
                        <span
                            className={
                                item.value === this.props.value
                                    ? styles.active
                                    : ""
                            }
                            onClick={() => this.props.onTabClick(item.value)}
                            key={item.value}
                        >
                            {item.label}
                        </span>
                    );
                })}
            </div>
        );
    }
}
