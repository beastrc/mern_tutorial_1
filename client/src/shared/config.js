module.exports = {
  getConfiguration: function() {
    return {
      API_ENDPOINT: _API_ENDPOINT_,
      SHOW_CLIENT_ERROR: _SHOW_CLIENT_ERROR_,
      SHOW_CLIENT_WARN: _SHOW_CLIENT_WARN_,
      SHOW_CLIENT_LOG: _SHOW_CLIENT_LOG_,
      S3_BUCKET_URL: _S3_BUCKET_URL_,
      CAPTCHA_SITE_KEY: _CAPTCHA_SITE_KEY_,
      ENV: _ENV_,
      STRIPE_CLIENT_ID: _STRIPE_CLIENT_ID_
    }
  }
};
