module.exports = app => {

    const controllerUser = require('./../controllers/user')
    const permAdmin = require('./../middlewares/permsAdmin');
    const permPrestador = require('./../middlewares/permsPrestador');

    app.post('/login', controllerUser.login);
    app.post('/register', controllerUser.register);

    app.post('/getUser', [permPrestador.perms, controllerUser.getUser]);

    app.post('/userChangePassword', controllerUser.trocaSenha)

    app.route('/user')
        // .all() inserir aqui o middleware        
        .put(controllerUser.edit)
        .delete([permPrestador.perms, controllerUser.delete])  
}