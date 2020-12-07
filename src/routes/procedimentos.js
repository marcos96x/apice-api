const controller = require('../controllers/user');

module.exports = app => {

    const controllerProcedimentos= require('./../controllers/procedimentos')
    const permAdmin = require('./../middlewares/permsAdmin');
    const permPrestador = require('./../middlewares/permsPrestador');

    app.get('/procedimento/:procedimento_id', controllerProcedimentos.get)
    app.get('/procedimentoCliente/:cliente_id', controllerProcedimentos.getByUser)

    app.route('/procedimento')
        .get(controllerProcedimentos.getAll)
        .post([permPrestador.perms, controllerProcedimentos.register]) 
        .put([permPrestador.perms, controllerProcedimentos.edit])
        .delete([permPrestador.perms, controllerProcedimentos.delete])
}