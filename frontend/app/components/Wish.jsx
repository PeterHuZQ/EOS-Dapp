import React from 'react'
import ReactDOM from 'react-dom'
import EOS from 'eosjs'

import {Button} from 'antd';

const EOS_CONFIG = {
  contractName: "son", // Contract name
  contractReceiver: "mother", // User executing the contract (should be paired with private key)
  clientConfig: {
    keyProvider: '5KkxKoLomM4wuWxpH8y3uZhiSv8qv1QLnTq78ffthHYwEaAg9pj', // Your private key
    httpEndpoint: 'http://127.0.0.1:8888' // EOS http endpoint
  }
}

class Wish extends React.Component {
  constructor(props) {
    super(props)
    this.state = { pingStatus: false }
  }

  sendPing() {
    this.setState({ pingStatus: 'loading' })
    let eosClient = EOS.Localnet(EOS_CONFIG.clientConfig)
    
    eosClient.contract(EOS_CONFIG.contractName)
      .then((contract) => {
        contract.wish(EOS_CONFIG.contractReceiver, { authorization: [EOS_CONFIG.contractReceiver] })
          .then((res) => { this.setState({ pingStatus: 'success' }) })
          .catch((err) => { this.setState({ pingStatus: 'fail' }); console.log(err) })
      })
  }

  render() {
    if (!this.state.pingStatus){
      return (<Button type="small" onClick={this.sendPing.bind(this)}>发送母亲节祝福</Button>)
    } else if (this.state.pingStatus == "loading") {
      return (<span style={{ color: "gray" }}>祝福发送中...</span>)
    } else if (this.state.pingStatus == "success") {
      return (<span style={{ color: "green" }}>发送成功!</span>)
    } else if (this.state.pingStatus == "fail") {
      return (<span style={{ color: "red" }}>发送失败</span>)
    }
  }
}

export default Wish

