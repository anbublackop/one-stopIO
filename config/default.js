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
  },

  jdoodleKeys: {
    clientId: 'ac4680b2f667cd4864a60e9d5cd4d18f',
    clientSecret: '4a941cc902adaca23c1e67330856b697726c68f84c5a88ccd1bf5c4cb7568ea3'
  }
  
};
