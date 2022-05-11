module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'backend',
      script: 'index.js',
      cwd: '/var/www/legably/backend/current',
      interpreter: '/usr/bin/node', // default
      instances: 1, //default
      exec_mode: 'fork', // default
      max_memory_restart: '500M',
      max_restarts: 10,
      restart_delay: 5000,
      source_map_support: false,
      error_file: '/var/www/legably/backend/shared/logs/backend-error.log',
      out_file: '/var/www/legably/backend/shared/logs/backend-out.log',
      pid_file: '/var/www/legably/backend/shared/pids/backend.pid',
      watch: false,
      env: {},
      env_staging: {},
      env_production: {},
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'deploy',
      key: './deploy/legably_deploy',
      host: ['18.220.245.33'],
      ssh_options: ['PasswordAuthentication=no', 'StrictHostKeyChecking=no'],
      ref: 'origin/master',
      repo: 'git@github.com:legably/production.git',
      path: '/var/www/legably/backend',
      'post-setup': 'cp /home/deploy/legably.backend.env /var/www/legably/backend/source/.env',
      'post-deploy':
        './deploy/post_deploy.sh && pm2 startOrRestart ecosystem.config.js --env production',
      env: {
        ENV: 'production',
      },
    },
    staging: {
      user: 'deploy',
      key: './deploy/legably_deploy',
      host: ['18.218.226.11'],
      ssh_options: ['PasswordAuthentication=no', 'StrictHostKeyChecking=no'],
      ref: 'origin/development',
      repo: 'git@github.com:legably/production.git',
      path: '/var/www/legably/backend',
      'post-setup': 'cp /home/deploy/legably.backend.env /var/www/legably/backend/source/.env',
      'post-deploy':
        './deploy/post_deploy.sh && pm2 startOrRestart ecosystem.config.js --env staging',
      env: {
        ENV: 'staging',
      },
    },
  },
};
