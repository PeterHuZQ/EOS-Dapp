import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Row, Col, Form, Input, Button,notification } from 'antd';

import './style.less';

class AddTodoItem extends React.Component{
    constructor(props) {
        super(props)
        this.saveNewItem = this.saveNewItem.bind(this)
    }
    saveNewItem(e) {
        e.preventDefault()
        let element = ReactDOM.findDOMNode(this.refs.newItem)
        let task = element.value
        if (!task) {
            notification.open({
                description: 'Todo内容不得为空！',
            });
        } else {
            this.props.handleSave(task)
            element.value = ""
        }
    }
    render(){
        return (
            <div className="addtodoitem">
                <Form.Item>
                    <label htmlFor="newItem"></label>
                    <Input id="newItem" ref="newItem" type="text" placeholder="请输入新任务~"></Input>
                    <Button type="primary" className="pull-right" onClick={this.saveNewItem}>保存</Button>
                </Form.Item>
            </div>
        )
    }
}

export default AddTodoItem;