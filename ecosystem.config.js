module.exports = {
  apps : [{
    script: 'npm start',}],

  deploy : {
    production : {
      user : 'ubuntu',
      host : '18.227.209.209',
      ref  : 'origin/master',
      repo : 'https://github.com/Phalanyx/Scriptorium.git',
      path : '/home/ubuntu',
      'pre-deploy-local': '',
      'post-deploy' : 'source ~/.nvm/nvm.sh && sh startup.sh && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes',
    }
  }
};
