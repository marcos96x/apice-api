const jwt = require("jsonwebtoken")
const authConfig = require("./../../lib/auth")
exports.perms = (req, res, next) => {

    const authToken = req.headers.authorization
    const parts = authToken.split(" ")
    const [scheme, token] = parts

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ err: "Token invalido" }).end()
        } else {
            if (decoded.id == req.body.usuario_id && req.body.usuario_perms === 'admin') {
                next()
            } else {
                return res.status(401).send({ err: "Token adulterado" }).end()
            }
        }
    
    })
}