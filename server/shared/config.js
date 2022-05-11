var nodemailer = require('nodemailer'),
dotenv = require('dotenv'),
dotenvParseVariables = require('dotenv-parse-variables');

var env = dotenv.config({path: '.env'}),
parsedEnv = dotenvParseVariables(env.parsed);

var database = {
  host: parsedEnv.DB_HOST,
  port: parsedEnv.DB_PORT,
  db: parsedEnv.DB_NAME,
};

if (parsedEnv.DB_USER) {
  database.username = parsedEnv.DB_USER,
  database.password = parsedEnv.DB_PASS
}

var server = {
  host: parsedEnv.SERVER_HOST,
  port: parsedEnv.SERVER_PORT
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  host: parsedEnv.SMTP_MAIL_HOST,
  port: parsedEnv.SMTP_MAIL_PORT,
  secure: parsedEnv.SMTP_MAIL_ISSECURE, // secure: true for port 465, secure: false for port 587
  auth: {
    user: parsedEnv.SMTP_MAIL_USER,
    pass: parsedEnv.SMTP_MAIL_PASS
  }
});

// setup email data with unicode symbols
var mailOptions = {
  from: parsedEnv.MAIL_FROM,
  to: parsedEnv.MAIL_TO, // list of receivers
  subject: parsedEnv.MAIL_SUBJECT, // Subject line
  text: parsedEnv.MAIL_TEXT, // plain text body
  html: parsedEnv.MAIL_HTML // html body
};

var fileUploadPath = __dirname.replace('shared', 'public/uploaded_files'),
hostPath = parsedEnv.HOST_PATH,
saltRounds = parsedEnv.SALT_ROUNDS,
showServerLog = parsedEnv.SHOW_SERVER_LOG;

var s3Bucket = parsedEnv.AWS_BUCKET;

var aws = {
  "key": parsedEnv.AWS_KEY,
  "secret": parsedEnv.AWS_SECRET,
  "bucket": s3Bucket
};

var bucketUrl = "https://" + s3Bucket + ".s3.amazonaws.com/";

// var payoneer = {
//   key: parsedEnv.PAYONEER_KEY,
//   secret: parsedEnv.PAYONEER_SECRET,
//   partner_id: parsedEnv.PAYONEER_PARTNER_ID
// };

var stripe = {
  client_id: parsedEnv.STRIPE_CLIENT_ID,
  secret_key: parsedEnv.STRIPE_SECRET_KEY,
  publishable_key: parsedEnv.STRIPE_PUBLISHABLE_KEY,
  redirect_url: parsedEnv.SUBSCRIPTION_REDIRECT_URL,
}

var subscriptions = {
  plan_1: parsedEnv.SUBSCRIPTION_PLAN1,
  plan_2: parsedEnv.SUBSCRIPTION_PLAN2,
  plan_3: parsedEnv.SUBSCRIPTION_PLAN3,
}

module.exports = {
  database: database,
  server: server,
  transporter: transporter,
  mailOptions: mailOptions,
  fileUploadPath: fileUploadPath,
  hostPath: hostPath,
  saltRounds: saltRounds,
  showServerLog: showServerLog,
  aws: aws,
  bucketUrl: bucketUrl,
  stripe,
  subscriptions,
  env: parsedEnv.ENV
};
