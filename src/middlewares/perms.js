exports.permis = (req, res, next) => {
    
    const id = req.body.usuario_id;

    if(id != "um id que tenha permissão para esse recurso"){
        return res.status(401).send({err: "Não autorizado!"}).end()
    }else{
        next();        
    }
}