import React,{Component} from 'react';

export default class FullpageLayout extends Component{
    render(){
        return (
            <div className="fullpage-layout">{this.props.children}</div>
        )
    }
}