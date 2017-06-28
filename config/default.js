import packageJSON from '../package.json';

module.exports = {
  app: {
    version: packageJSON.version,
    title: 'Techracers Traning Management System',
    description: packageJSON.description
  },

  dir_structure: {
    models: 'app/models/**/*.js',
    routes: 'app/routes/**/*Routes.js',
    controllers: 'app/conrollers/**/*Controller.js'
  },

  db: {
    uri: `mongodb://localhost:45123/training`,
    options: {
      user: 'mishti',
      pass: 'doi',
      server: { poolSize: 40 },
      replset: { poolSize: 40 }
    },
    debug: false
  },
};
