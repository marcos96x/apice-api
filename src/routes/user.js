module.exports = app => {

    const controllerUser = require('./../controllers/user')

    app.post('/login', controllerUser.login);
    app.post('/register', controllerUser.register);

    app.post('/getUser', controllerUser.getUser);

    app.post('/userChangePassword', controllerUser.trocaSenha)

    app.route('/user')
        // .all() inserir aqui o middleware        
        .put(controllerUser.edit)
        .delete(controllerUser.delete)

  
}