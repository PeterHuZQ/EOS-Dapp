import React, { Component } from 'react';
import Board from './Board';
import Chess from './Chess';

import {Button,Input} from 'antd';
import EOS from 'eosjs'
import './style.less';

const EOS_CONFIG = {
    contractName: "tic.tac.toe", // Contract name
    contractSender: "tic.tac.toe", // User executing the contract (should be paired with private key)
    clientConfig: {
      keyProvider: '5KJaZrmBkBKue3XmCN6gkQM7LJhVEALsF7BjtF8L8YmVZBtRtQW', // Your private key
      httpEndpoint: 'http://127.0.0.1:8888' // EOS http endpoint
    }
}

//Game 组件渲染出一块棋盘
class Game extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
          host: "", 
          challenger: "",
          turn: "",
          winner: "",
          squares: [],
          noplayer: true,
          loading: false
        }

        this.move = this.move.bind(this);

        //初始化EOS
        this.eosClient = EOS.Localnet(EOS_CONFIG.clientConfig)
    }

    componentDidMount(){
        this.get_gameinfo();
    }

    //从链上获取棋盘信息
    get_gameinfo() {
        this.eosClient.getTableRows(true, 'tic.tac.toe', 'initb','games').then((data) => {
            if(data.rows == false){
                let board_len = 9;
                let board = []
                for (let i = 0; i < board_len ; i++) {
                    board[i] = null;
                }
                this.setState({ 
                    host: "", 
                    challenger: "",
                    turn: "",
                    winner: "",
                    squares: board,
                    noplayer: true,
                    loading: false  
                })
                this.refs.hostPlayer.value = ""
                this.refs.challengerPlayer.value = ""
                return
            }
            let board_len = 9;
            let board = []
            for (let i = 0; i < board_len ; i++) {
                board.push(data.rows[0].board[i]);
            }
            this.setState({ 
                host: data.rows[0].host, 
                challenger: data.rows[0].challenger,
                turn: data.rows[0].turn,
                winner: data.rows[0].winner,
                squares: board 
            })
            this.refs.hostPlayer.value = data.rows[0].host
            this.refs.challengerPlayer.value = data.rows[0].challenger
        }).catch((e) => {
            console.error(e);
        })
    }

    //创建游戏
    create_game = () => {
        const hostPlayer = this.refs.hostPlayer.value;
        const challengerPlayer = this.refs.challengerPlayer.value;
        if( hostPlayer == "" || challengerPlayer == ""){
            alert("请先设置玩家")
            return
        }
        this.setState({
            host: hostPlayer, 
            challenger: challengerPlayer,
            turn: hostPlayer,
            loading: true,
            noplayer:false
        })
        this.eosClient.contract(EOS_CONFIG.contractName).then((contract) => {
            contract.create(
                challengerPlayer,
                hostPlayer,
              { authorization: [challengerPlayer,hostPlayer]} 
            ).then((res) => { this.setState({ loading: false }) })
            .catch((err) => { this.setState({ loading: false }); console.log(err) })
        })
    }

    move(x,y){
        const hostPlayer = this.refs.hostPlayer.value;
        const challengerPlayer = this.refs.challengerPlayer.value;
        if( hostPlayer == "" || challengerPlayer == ""){
            alert("请先设置玩家")
            return
        }
        //用slice(),复制数据再修改
        const copy = this.state.squares.slice();
        let i = x*3 + y;
        if ( get_winner(copy) ) {
            alert("游戏已结束，请重新开始")
            return
        }
        if( this.state.loading ) {
            alert("正在执行，请稍后操作")
            return
        }
        this.setState({loading: true})
        let move = {
            challenger: this.state.challenger,
            host: this.state.host,
            by: this.state.turn,
            mvt: {"row":x, "column":y}
        }
        this.eosClient.contract(EOS_CONFIG.contractName).then((contract) => {
            contract.move(
              move.challenger,
              move.host,
              move.by,
              move.mvt,
              { authorization: [move.challenger,move.host,move.by]} 
            ).then((res) => { this.setState({ loading: false }) })
            .catch((err) => { this.setState({ loading: false }); console.log(err) })
        })

        // Fill the cell, 1 for host, 2 for challenger 
        // copy[i] = this.state.turn == this.state.host ? '1' : '2';
        copy[i] = this.state.turn == this.state.host ? 'unit unit-b' : 'unit unit-w';
        // 改变状态，此时会重新调用render()方法
        this.setState({
            squares: copy,
            turn: this.state.turn == this.state.host ? this.state.challenger : this.state.host
        }); 
    }
    
    //重新开始游戏
    reset_game = () =>{
        this.setState({loading: true})
        this.eosClient.contract(EOS_CONFIG.contractName).then((contract) => {
            contract.restart(
              this.state.challenger,
              this.state.host,
              this.state.host,
              
              { authorization: [this.state.challenger,this.state.host,this.state.host] }
            ).then((res) => { 
                this.setState({ 
                    turn: this.state.host,
                    winner:"",
                    loading: false
                })
                this.get_gameinfo();
            })
            .catch((err) => { this.setState({ loading: false }); console.log(err) })
        })
    }

    //关闭游戏
    close_game = () => {
        this.eosClient.contract(EOS_CONFIG.contractName).then((contract) => {
            contract.close(
                this.state.challenger,
                this.state.host,
              { authorization: [this.state.challenger,this.state.host]} 
            ).then((res) => {
                this.get_gameinfo();
            })
            .catch((err) => { this.setState({ loading: false }); console.log(err) })
        })
    }

    render(){
        const winner = get_winner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + (winner == 'unit unit-b' ? this.state.host : this.state.challenger);
        } else {
            //status = 'Now player: ' + (this.state.turn == this.state.host ? this.state.host : this.state.challenger);
            status = this.state.loading ? <small>(正在执行...)</small> : 'Now player: ' + (this.state.turn == this.state.host ? this.state.host : this.state.challenger)
        }
        
        return(
            <div className="game">
                {/* 游戏区 */}
                <div className="game-board">
                    <Board squares={this.state.squares}
                           handleMove={this.move}
                           status={status}
                    />
                </div>
                 {/* 游戏信息 */}
                <div className="game-info">
                    <ol>黑棋玩家(先手)：<input ref="hostPlayer"/></ol>
                    <ol>
                        白棋玩家(后手)：<input ref="challengerPlayer"/>
                    </ol>
                    <ol>
                        <Button type="small" onClick={this.create_game}>开始游戏</Button>
                    </ol>
                    <ol>
                        <Button type="small" onClick={this.reset_game}>重新开始</Button>
                    </ol>
                    <ol>
                        <Button type="small" onClick={this.close_game}>关闭游戏</Button>
                    </ol>
                    
                </div>
            </div>
        )    
    }
}

export default Game

function get_winner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}