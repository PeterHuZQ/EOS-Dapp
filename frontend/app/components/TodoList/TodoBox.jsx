import React, { Component } from 'react';
import TodoList from './TodoList';
import AddTodoItem from './AddTodoItem';
import {Card} from 'antd';
import EOS from 'eosjs'

const EOS_CONFIG = {
  contractName: "todo.user", // Contract name
  contractSender: "todo.user", // User executing the contract (should be paired with private key)
  clientConfig: {
    keyProvider: '5JEnXfs3bKqzcUSYzP4wyG7ztiBsrWzNab12v6sa5ftQWuARhnE', // Your private key
    httpEndpoint: 'http://127.0.0.1:8888' // EOS http endpoint
  }
}

class TodoBox extends React.Component{
    constructor(props) {
        super(props)
        //初始任务列表
        this.state = {
          todos: [
          ],
          finished: 0,
          loading: false
        }
        this.addTask = this.addTask.bind(this);
        this.updateFinished = this.updateFinished.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        //初始化EOS
        this.eosClient = EOS.Localnet(EOS_CONFIG.clientConfig)
    }
    componentDidMount() {
      this.loadTodos();
      this.loadFinish();
    }
    loadTodos() {
      this.eosClient.getTableRows(true, 'todo.user', 'todo.user','todos').then((data) => {
        this.setState({ todos: data.rows })
      }).catch((e) => {
        console.error(e);
      })
    }
    loadFinish(){
      var sum = 0;
      let list = this.state.todos;
      for (let item of list) {
        if (item.completed === 1) {
          sum++;
        }
      }
      this.setState({
        finished : sum
      })
    }
    //添加新任务，在组件中以props的形式传递给子组件
    addTask(task) {
      this.setState({loading: true})
      let newItem = {
        id: (this.state.todos.length+1),
        task,
        completed: 0
      }
      let list = this.state.todos;
      list = list.concat([newItem])
      this.setState({
        todos : list
      })
      this.eosClient.contract(EOS_CONFIG.contractName).then((contract) => {
        contract.create(
          EOS_CONFIG.contractSender,
          newItem.id,
          task,
          { authorization: [EOS_CONFIG.contractSender] }
        ).then((res) => { this.setState({ loading: false }) })
        .catch((err) => { this.setState({ loading: false }); console.log(err) })
      })
    }
    //更新完成的任务，在组件中以props的形式传递给子组件
    updateFinished(taskId) {
        this.setState({loading: true})
        var sum = 0;
        let list = this.state.todos;
        for (let item of list) {
          if (item.id === taskId) {
            item.completed = item.completed === 1 ? 0 : 1
          }
          if (item.completed === 1) {
            sum++;
          }
        }
        this.setState({
          todos : list ,
          finished : sum
        })
        this.eosClient.contract(EOS_CONFIG.contractName).then((contract) => {
          contract.complete(
            EOS_CONFIG.contractSender,
            taskId,
            { authorization: [EOS_CONFIG.contractSender] }
          ).then((res) => { this.setState({ loading: false }) })
          .catch((err) => { this.setState({ loading: false }); console.log(err) })
        })
    }
    //删除任务
    deleteTask(taskId) {
        this.setState({loading: true})
        var sum = 0;
        let list = this.state.todos;
        list = list.filter(task => task.id !== taskId)
        for (let item of list) {
          if (item.completed === 1) {
            sum++;
          }
        }
        this.setState({
          todos : list ,
          finished : sum
        })
        this.eosClient.contract(EOS_CONFIG.contractName).then((contract) => {
          contract.destroy(
            EOS_CONFIG.contractSender,
            taskId,
            { authorization: [EOS_CONFIG.contractSender] }
          ).then((res) => { this.setState({ loading: false }) })
          .catch((err) => { this.setState({ loading: false }); console.log(err) })
        })
    }
    render(){
        return (
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                  <Card title="任务便签" bordered={false} style={{ width: 500 }}>
                      <TodoList todos={this.state.todos}
                                handleFinished={this.updateFinished} 
                                handleDelete={this.deleteTask}/>
                      <AddTodoItem handleSave={this.addTask}/>
                      <div style={{ float:'right' }}>
                      {this.state.loading ? <small>(正在保存...)</small> : ""}{this.state.finished}已完成&nbsp;/&nbsp;{this.state.todos.length}总数
                      </div>
                    </Card>
                </div>
        )
    }
}

export default TodoBox