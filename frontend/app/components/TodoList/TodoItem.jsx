import React, { Component } from 'react';
import {Row, Col, Checkbox, Button, Divider} from 'antd';

import './style.less';

class TodoItem extends React.Component{
    constructor(props) {
        super(props)
        this.finishItem = this.finishItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
    }
    finishItem() {
        this.props.handleFinished(this.props.taskId)
    }
    deleteItem() {
        this.props.handleDelete(this.props.taskId)
    }
    render(){
        let task = this.props.task
        let itemChecked
        if (this.props.complete === "true") {
            task = <del>{task}</del>
            itemChecked = true
        } else {
            itemChecked = false
        }
        return (
            <li className="list-group-item">
                <Row>
                    <Col span={20}>
                        <Checkbox checked={itemChecked} onChange={this.finishItem}/> {task}
                    </Col>
                    <Col span={4}>
                        <Button type="danger" className="pull-right" onClick={this.deleteItem} size="small">删除</Button>
                    </Col>
                </Row>
                <Divider />
            </li>
        )
    }
}

export default TodoItem;