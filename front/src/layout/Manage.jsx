import React, { Component } from 'react';

import Header from '@/components/Header';
import SideBar from '@/components/SideBar';

export default class ManageLayout extends Component {
    render() {
        return (
            <div className="manage-layout">
                <Header></Header>
                <SideBar></SideBar>
                <div className="app">{this.props.children}</div>
            </div>
        )
    }
}