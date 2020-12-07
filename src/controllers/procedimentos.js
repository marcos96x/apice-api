const jwt = require("jsonwebtoken");
const authConfig = require("./../../lib/auth.json");
const bcrypt = require("bcrypt");
const database = require("../config/database")();

function geraToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

const controller = {

    /**
     * 
    "procedimento": {
        "titulo": "Titulo de um procedimento",
        "desc": "Essa é uma descrição curta",
        "tipo": 'tipo do procedimento'
        "cliente": 1
    },
    "token": token
     */
    register: (req, res) => {
        const { titulo, desc, tipo, cliente } = req.body.procedimento;

        const data = [
            "default",
            "'" + titulo + "'",
            "'" + desc + "'",
            "NOW()",
            "1",
            "'" + tipo + "'",
            "'" + cliente + "'"
        ]

        database.query("INSERT INTO procedimento VALUES (" + data + ")", (err2, rows2) => {

            if (err2) {
                // Debug
                console.log(err2);
                return res.status(500).send({ err: 'Internal database server error.' }).end()
            } else {
                // Debug
                console.log(rows2);
                return res.status(200).send({
                    msg: "Cadastro realizado com sucesso!"
                }).end()
            }
        })

    },
     /**
     * 
    "procedimento": {
        "id": 1,
    },
    "token": token
     */
    get: (req, res) => {
        const { id } = req.params.procedimento_id;
        if(id > 0) {
            database.query("SELECT * FROM procedimento WHERE procedimento_id = ?", [id], (err, rows) => {
                if (err) {
                    // Debug
                    console.log(err);
                    return res.status(500).send({ err: 'Internal database server error.' }).end()
                } else {
                    return res.status(200).send({ procedimentos: rows[0] }).end()
                }
            })
        }        
    },
     /**
     * 
    "usuario": {
        "id": 1,
    },
    "token": token
     */
    getByUser: (req, res) => {
        const id = req.params.cliente_id;
        if(id > 0) {
            database.query("SELECT * FROM procedimento WHERE procedimento_cliente = ?", [id], (err, rows) => {
                if (err) {
                    // Debug
                    console.log(err);
                    return res.status(500).send({ err: 'Internal database server error.' }).end()
                } else {
                    if(rows.length != []) {
                        return res.status(200).send({ procedimentos: rows }).end()
                    } else {
                        return res.status(200).send({ procedimentos: [] }).end()
                    }
                    
                }
            })
        }        
    },
    /**
     * 
    "token": token
     */
    getAll: (req, res) => {
        // admin request
        database.query("SELECT procedimento.*, usuario.usuario_nome, usuario.usuario_id FROM procedimento JOIN usuario ON usuario.usuario_id = procedimento.procedimento_cliente", (err, rows) => {
            if (err) {
                // Debug
                console.log(err);
                return res.status(500).send({ err: 'Internal database server error.' }).end()
            } else {
                if (rows.length != []) {
                    return res.status(200).send({ procedimentos: rows }).end()
                } else {
                    return res.status(401).send({ err: 'Nenhum procedimento foi encontrado.' }).end()
                }
            }
        })
    },
    /**
     * 
    "procedimento": {
        campo: valor,
        campo: valor,
        procedimento_id = 1
    },
    "token": token
     */
    edit: (req, res) => {
        database.query("UPDATE procedimento SET ? WHERE procedimento_id = ? ", [req.body.procedimento, req.body.procedimento.procedimento_id], (err, rows) => {
            if (err) {
                return res.status(200).send({ err: err }).end()
            } else {
                return res.status(200).send({ msg: "Dados alterados com sucesso!" }).end()
            }
        })

    },

    /**
     * 
    "procedimento": {
        procedimento_id = 1
    },
    "token": token
     */
    delete: (req, res) => {
        // admin request       

        database.query("DELETE FROM procedimento WHERE procedimento_id = ?", [req.body.procedimento.procedimento_id], (err2, rows2) => {
            if (err2) {
                // Debug
                console.log(err);
                return res.status(500).send({ err: 'Internal database server error.' }).end()
            } else {
                return res.status(200).send({ msg: "Ok" }).end()
            }

        })
    },

}

module.exports = controller;