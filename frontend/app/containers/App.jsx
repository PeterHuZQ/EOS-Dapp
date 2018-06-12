import React, { Component } from 'react';

import {
    Link
} from 'react-router-dom';

import './style.less';

import { Row,Col,Divider,Icon} from 'antd';

class App extends Component {
    render() {
      return (
        <div>
          <div className="gutter-example">
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <div className="gutter-box"><Link to="/">Demo1</Link></div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div className="gutter-box"><Link to="/todo">Demo2</Link></div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div className="gutter-box"><Link to="/tictactoe">Demo3</Link></div>
              </Col>
              <Col className="gutter-row" span={6}>
                <div className="gutter-box"><Link to="/home">Demo4</Link></div>
              </Col>
            </Row>
          </div>
          <Divider orientation="left"><a href="https://github.com/PeterHuZQ/EOS-Dapp"><Icon type="github"/>欢迎Star</a></Divider>
          {this.props.children}
        </div>
      );
    }
  }

export default App;