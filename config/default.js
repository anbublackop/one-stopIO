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
    uri: 'mongodb+srv://root:tiger@oauth-database-vfzst.mongodb.net/test?retryWrites=true&w=majority', 
  },
  
	session: {
		cookieKey: 'thisisarandomstring'
  }
  
};
