import React, { Component } from 'react';
import TodoList from './TodoList';
import AddTodoItem from './AddTodoItem';
import {Card} from 'antd';

export default class TodoBox extends React.Component{
    constructor(props) {
        super(props)
        //初始任务列表
        this.state = {
          data: [
            
          ],
          finished: 0
        }
        this.addTask = this.addTask.bind(this);
        this.updateFinished = this.updateFinished.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }
    generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
    }
    //添加新任务，在组件中以props的形式传递给子组件
    addTask(task) {
      let newItem = {
        id: this.generateGUID(),
        task,
        complete: "false"
      }
      let list = this.state.data;
      list = list.concat([newItem])
      this.setState({
        data : list
      })
    }
    //更新完成的任务，在组件中以props的形式传递给子组件
    updateFinished(taskId) {
        var sum = 0;
        let list = this.state.data;
        for (let item of list) {
          if (item.id === taskId) {
            item.complete = item.complete === "true" ? "false" : "true"
          }
          if (item.complete === "true") {
            sum++;
          }
        }
        this.setState({
          data : list ,
          finished : sum
        })
    }
    //删除任务
    deleteTask(taskId) {
        var sum = 0;
        let list = this.state.data;
        list = list.filter(task => task.id !== taskId)
        for (let item of list) {
          if (item.complete === "true") {
            sum++;
          }
        }
        this.setState({
          data : list ,
          finished : sum
        })
    }
    render(){
        return (
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                  <Card title="任务便签" bordered={false} style={{ width: 500 }}>
                      <TodoList data={this.state.data}
                                handleFinished={this.updateFinished} 
                                handleDelete={this.deleteTask}/>
                      <AddTodoItem handleSave={this.addTask}/>
                      <div style={{ float:'right' }}>
                        {this.state.finished}已完成&nbsp;/&nbsp;{this.state.data.length}总数
                      </div>
                    </Card>
                </div>
        )
    }
}