import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import RouteMap from './router/RouteMap';
import { hashHistory } from 'react-router-dom'



ReactDOM.render(
  <RouteMap history={hashHistory}/>,
  document.getElementById('app')
);
