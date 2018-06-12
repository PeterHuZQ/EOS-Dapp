import React, { Component } from 'react';

import {
    HashRouter,
    Route
  } from 'react-router-dom';

import App from '../containers/App';
import Wish from '../components/Wish';
import TodoBox from '../components/TodoList/TodoBox';
import Game from '../components/TicTacToe/Game';
import Home from '../components/Home';

class RouterMap extends React.Component {
    render() {
        return (
            <HashRouter history={this.props.history}>
                <App>
                     <Route exact path="/" component={Wish} />
                     <Route path="/todo" component={TodoBox} />
                     <Route path="/tictactoe" component={Game} />
                     <Route path="/home" component={Home} />
                </App>
            </HashRouter>
        )
    }
}

export default RouterMap