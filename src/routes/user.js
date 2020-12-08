module.exports = app => {

    const controllerUser = require('./../controllers/user')
    const permAdmin = require('./../middlewares/permsAdmin');
    const permPrestador = require('./../middlewares/permsPrestador');

    app.post('/login', controllerUser.login);
    app.post('/register', controllerUser.register);    

    app.post('/getUser', [controllerUser.getUser]);

    app.post('/userChangePassword', controllerUser.trocaSenha)

    app.route('/user')
        // .all() inserir aqui o middleware       
        .get([controllerUser.getAllClientes]) 
        .put(controllerUser.edit)
        .delete([controllerUser.delete])  

    // admin
    app.post('/registerPrestador', [controllerUser.registerPrestador]);
    app.get('/getPrestadores', [controllerUser.getAllPrestadores]);
}