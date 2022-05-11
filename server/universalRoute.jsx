var React = require('react');
var router = require('express').Router();
var ReactDOMServer = require('react-dom/server');
var ReactRouter = require('react-router');
var Redux = require('redux');
var Provider = require('react-redux').Provider;
var useragent = require('useragent');
var routes = require('../client/src/routes.jsx');

function reducer(state) {
  return state;
}

router.get('*', function(request, response) {
  var initialState = { title: 'Legably' };
  var store = Redux.createStore(reducer, initialState);

  ReactRouter.match({
    routes: routes,
    location: request.url
  }, function(error, redirectLocation, renderProps) {
    if (renderProps) {
      var html = ReactDOMServer.renderToString(
        <Provider store={store}>
          <ReactRouter.RouterContext {...renderProps} />
        </Provider>
      );
      var userAgent = request.headers['user-agent'];
      var agent = useragent.is(userAgent);
      if ((!agent.firefox && !agent.chrome && !agent.safari) || (userAgent.indexOf("Edge") > -1)) {
        html = html.replace(/<\/body>/g,'<div class=\"alert-success ie-alert\"><div class=\"text-center\"><span><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i></span> For the best experience, please use Legably in Google Chrome or Mozilla Firefox or Safari.</div><div class=\"close-alert\" onClick=\"$(\'.ie-alert\').addClass(\'hide-ie-alert\')\">x</div></div></body>');
      }
      response.send(html);
    } else {
      response.status(404).send('Not Found');
    }
  });
});

module.exports = router;
