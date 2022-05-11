var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var Provider = require('react-redux').Provider;

var routes = require('./routes.jsx');

function reducer(state) {
  return state;
}

var store = Redux.createStore(reducer, window.PROPS);

ReactDOM.render(
  <Provider store={store}>
    {routes}
  </Provider>, document
);
