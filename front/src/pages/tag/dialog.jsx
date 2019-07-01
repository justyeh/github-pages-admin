import React, { Component } from "react";
import { Input, Form, Modal } from "antd";
import PropTypes from "prop-types";

class TagForm extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        onCancel: PropTypes.func,
        onOk: PropTypes.func
    };

    onOk = () => {
        this.props.form.validateFields(async (err, values) => {
            if (err) {
                return false;
            }
            this.props.onOk(values);
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title={`Update Tag : ${this.props.name}`}
                visible={this.props.visible}
                onOk={this.onOk}
                onCancel={this.props.onCancel}
            >
                <Form layout="vertical">
                    <Form.Item label="名称">
                        {getFieldDecorator(
                            "name",
                            { initialValue: this.props.name },
                            {
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入名称!"
                                    }
                                ]
                            }
                        )(<Input autoComplete="off" />)}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

const TagDialog = Form.create({})(TagForm);

export default TagDialog;
