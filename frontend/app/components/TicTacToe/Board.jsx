import React, { Component } from 'react';
import Square from './Square';
import Chess from './Chess';

//Board 组件会渲染出九宫格
class Board extends React.Component{
    constructor(props) {
        super(props);
    }

    renderSquare(x,y) {
        let i = x*3 + y;
        return (
            // 父组件为子组件设置属性：添加属性value,其值为状态数组中的值;添加属性onClick
            <Square 
                value={<Chess style={this.props.squares[i]}/>}
                onClick={() => this.props.handleMove(x,y)} 
            />
        );
    }
    
    render(){
        return(
            <div>
                {/* 显示游戏状态 */}
                <div className="status">{this.props.status}</div>
                {/* 显示九宫格 */}
                <div className="board-row">
                    {this.renderSquare(0,0)}
                    {this.renderSquare(0,1)}
                    {this.renderSquare(0,2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(1,0)}
                    {this.renderSquare(1,1)}
                    {this.renderSquare(1,2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(2,0)}
                    {this.renderSquare(2,1)}
                    {this.renderSquare(2,2)}
                </div>
            </div>
        )    
    }
}

export default Board