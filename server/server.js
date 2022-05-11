require('babel-register')({
  presets: ['react', 'es2015']
});

var rfr = require('rfr'),
  express = require('express'),
  http = require('http'),
  bodyParser = require('body-parser');

rfr('/server/db/index');
rfr('/server/schemas/ddl/index');

var config = rfr('/server/shared/config'),
  utils = rfr('/server/shared/utils'),
  routes = rfr('/server/routes');
const chatConnection = rfr('/server/controllers/connection.js');

// initialize our application
function start() {
  var app = express();

  app.use(bodyParser.json({ limit: '500mb' })); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' })); // support encoded bodies

  //To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, HEAD, OPTIONS, POST, PUT, DELETE'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    );

    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

  app.use(express.static('./client/src/assets'));
  app.use(express.static('./client/dist'));

  var PORT = config['server']['port'];
  const server = http.createServer(app).listen(PORT, function() {
    utils.log('Server started successfully on port -->', PORT);
    routes.bindAllRequests(app);
    app.use(rfr('/server/universalRoute.jsx'));
  });
  chatConnection.buildConnection(server);
}

module.exports.start = start;
