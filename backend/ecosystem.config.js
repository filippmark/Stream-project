module.exports = {
  apps : [{
    name: 'ts app',
    script: './node_modules/.bin/ts-node',
    args: './src/app.ts',
    watch: ['src'],
    ignore_watch: ['node_modules'],
    interpreter: 'node_modules/.bin/ts-node',
    node_args: ['--require=tsconfig-paths/register'],
    env: {
        "production": true
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
