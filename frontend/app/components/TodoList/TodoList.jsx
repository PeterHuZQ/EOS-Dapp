import React, { Component } from 'react';
import TodoItem from './TodoItem';

class TodoList extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        var taskList=this.props.data.map(listItem=>
            <TodoItem key={listItem.id}
                      taskId={listItem.id}
                      task={listItem.task}
                      complete={listItem.complete}
                      handleFinished={this.props.handleFinished}
                      handleDelete={this.props.handleDelete}/>
        )
        return (
            <ul className="list-group">
                {taskList}
            </ul>
        )
    }
}

export default TodoList;