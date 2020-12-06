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
    "blog": {
        "titulo": "Titulo de um blog",
        "desc": "Essa é uma descrição curta",
        "desc_full": "Descrição longa",
        "home": 1
    },
    "token": token
     */
    register: (req, res) => {
        const { titulo, desc, desc_full, home } = req.body.blog;

        const data = [
            "default",
            "'" + titulo + "'",
            "'" + desc + "'",
            "'" + desc_full + "'",
            "NOW()",
            "'" + home + "'",
        ]

        database.query("INSERT INTO blog VALUES (" + data + ")", (err2, rows2) => {

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
    "blog": {
        "id": 1,
    },
    "token": token
     */
    get: (req, res) => {
        const { id } = req.params.blog_id;
        if(id > 0) {
            database.query("SELECT * FROM blog WHERE blog_id = ?", [id], (err, rows) => {
                if (err) {
                    // Debug
                    console.log(err);
                    return res.status(500).send({ err: 'Internal database server error.' }).end()
                } else {
                    return res.status(200).send({ usuario: rows[0] }).end()
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
        database.query("SELECT * FROM blog", (err, rows) => {
            if (err) {
                // Debug
                console.log(err);
                return res.status(500).send({ err: 'Internal database server error.' }).end()
            } else {
                if (rows.length != []) {
                    return res.status(200).send({ blogs: rows }).end()
                } else {
                    return res.status(401).send({ err: 'Nenhuma postagem de blog foi encontrado.' }).end()
                }
            }
        })
    },
    /**
     * 
    "blog": {
        campo: valor,
        campo: valor,
        blog_id = 1
    },
    "token": token
     */
    edit: (req, res) => {
        database.query("UPDATE blog SET ? WHERE blog_id = ? ", [req.body.blog, req.body.blog.blog_id], (err, rows) => {
            if (err) {
                return res.status(200).send({ err: err }).end()
            } else {
                return res.status(200).send({ msg: "Dados alterados com sucesso!" }).end()
            }
        })

    },

    /**
     * 
    "blog": {
        blog_id = 1
    },
    "token": token
     */
    delete: (req, res) => {
        // admin request
        

        database.query("DELETE FROM blog WHERE blog_id = ?", [req.body.blog.blog_id], (err2, rows2) => {
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