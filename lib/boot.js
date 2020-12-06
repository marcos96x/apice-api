module.exports = app => {
    app.listen(app.get('port'), () =>  console.log(`Server on - porta ${app.get('port')}`))
}