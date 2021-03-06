const controller = require('../controllers/user');

module.exports = app => {

    const controllerBlog = require('./../controllers/blog');
    // const permAdmin = require('./../middlewares/permsAdmin');
    const permPrestador = require('./../middlewares/permsPrestador');

    app.get('/blog/:blog_id', controllerBlog.get)
    app.route('/blog')
        .get(controllerBlog.getAll)       
        .post([controllerBlog.register]) 
        .put([controllerBlog.edit])
        .delete([controllerBlog.delete])
}