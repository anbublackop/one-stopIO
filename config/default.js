import packageJSON from '../package.json';

module.exports = {
  app: {
    version: packageJSON.version,
    title: 'One-Stop I/O',
    description: packageJSON.description
  },

  dir_structure: {
    models: 'app/models/**/*.js',
    routes: 'app/routes/**/*Routes.js',
    controllers: 'app/conrollers/**/*Controller.js'
  },

  db: {
    uri: 'mongodb+srv://root:tiger@cluster0-vfzst.mongodb.net/test?retryWrites=true&w=majority', 
    debug: true
  },
  
	session: {
		cookieKey: 'thisisarandomstring'
  }
  
};
