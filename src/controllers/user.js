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

    register: (req, res) => {
        const { login, senha, nome, cpf, nascimento, telefone, email } = req.body.usuario;

        database.query("SELECT * FROM usuario WHERE usuario_login = ?;", [login], (err, rows) => {

            if (err) {
                // Debug
                console.log(err);
                return res.status(500).send({ msg: 'Internal database server error.' }).end()
            } else {
                if (rows.length == []) {
                    bcrypt.hash(senha, 10, (errHash, hash) => {
                        if (errHash) {
                            console.log(err);
                            return res.status(500).send({ msg: 'Internal server error.' }).end()
                        } else {
                            const data = [
                                "default",
                                "'cliente'",
                                "'" + login + "'",
                                "'" + hash + "'",
                                "'" + nome + "'",
                                "'" + cpf + "'",
                                "'" + nascimento + "'",
                                "'" + telefone + "'",
                                "'" + email + "'",
                                "''",
                                "1"
                            ]

                            database.query("INSERT INTO usuario VALUES (" + data + ")", (err2, rows2) => {

                                if (err2) {
                                    // Debug
                                    console.log(err2);
                                    return res.status(500).send({ msg: 'Internal database server error.' }).end()
                                } else {
                                    // Debug
                                    console.log(rows2);

                                    const token = "Bearer " + geraToken({ id: rows2.insertId });

                                    return res.status(200).send({
                                        msg: "Cadastro realizado com sucesso!",
                                        token: token,
                                        id: rows2.insertId
                                    }).end()
                                }
                            })
                        }
                    })
                } else {
                    return res.status(201).send({ msg: 'Este login já está cadastrado.' }).end()
                }
            }
        })

    },
    login: (req, res) => {

        const { login, senha } = req.body.usuario;
        database.query("SELECT usuario_id, usuario_senha FROM usuario WHERE usuario_login = ?;", [login], (errLogin, rowsLogin) => {
            if (errLogin) {
                // Debug
                console.log(errLogin);
                return res.status(500).send({ msg: 'Internal database server error.' }).end()
            } else {
                // Debug
                console.log(rowsLogin);
                if (rowsLogin.length != []) {

                    bcrypt.compare(senha, rowsLogin[0].usuario_senha)
                        .then((result) => {
                            if (!result) {
                                return res.status(201).send({ err: "Senha incorreta! Por favor, tente novamente" }).end()
                            } else {
                                const token = "Bearer " + geraToken({ id: rowsLogin[0].usuario_id });
                                // PERMISSÃO INSERIDA NO TOKEN
                                // const token = "Bearer " + geraToken({ id: rowsLogin[0].usuario_id, perm: rowsLogin[0].usuario_tipo });

                                return res.status(200).send({
                                    msg: "Login realizado com sucesso!",
                                    token: token,
                                    id: rowsLogin[0].usuario_id
                                }).end()
                            }
                        })
                } else {
                    return res.status(404).send({ msg: 'Usuário não encontrado' }).end()
                }

            }
        })
    },
    getUser: (req, res) => {
        const { id } = req.body.usuario;

        database.query("SELECT usuario_login, usuario_nome, usuario_cpf, DATE_FORMAT(usuario_nascimento, '%d/%m/%Y') AS usuario_nascimento, usuario_telefone, usuario_email, usuario_ficha FROM usuario WHERE usuario_id = ?", [id], (err, rows) => {
            if (err) {
                // Debug
                console.log(err);
                return res.status(500).send({ msg: 'Internal database server error.' }).end()
            } else {
                const token = "Bearer " + geraToken({ id: id });
                return res.status(200).send({ usuario: rows[0], token: token }).end()
            }
        })
    },
    getUsers: (req, res) => {
        // admin request
        const { idUser } = req.body;

        database.query("SELECT * FROM usuario WHERE usuario_id = ?", [idUser], (err, rows) => {
            if (err) {
                // Debug
                console.log(err);
                return res.status(500).send({ msg: 'Internal database server error.' }).end()
            } else {
                if (rows.length != []) {
                    return res.status(200).send({ users: rows }).end()
                } else {
                    return res.status(500).send({ msg: 'Você não tem permissão para executar esse recurso.' }).end()
                }
            }
        })
    },
    edit: (req, res) => {
        database.query("UPDATE usuario SET ? WHERE usuario_id = ? ", [req.body.usuario, req.body.usuario.usuario_id], (err, rows) => {
            if (err) {
                return res.status(200).send({ err: err }).end()
            } else {
                let newToken = "Bearer " + geraToken({ "id": req.body.usuario.usuario_id })
                return res.status(200).send({ msg: "Dados alterados com sucesso!", token: newToken }).end()
            }
        })

    },
    delete: (req, res) => {
        // admin request
        const { usuario_id } = req.body.usuario;

        database.query("DELETE FROM usuario WHERE usuario_id = ?", [usuario_id], (err2, rows2) => {
            if (err2) {
                // Debug
                console.log(err);
                return res.status(500).send({ msg: 'Internal database server error.' }).end()
            } else {
                return res.status(200).send({ msg: "Ok" }).end()
            }

        })
    },

    // Recursos
    trocaSenha: (req, res) => {
        let senha_nova = req.body.usuario.senha_nova
        let senha_antiga = req.body.usuario.senha_antiga
        let usuario_id = req.body.usuario.usuario_id
    
        database.query("SELECT * FROM usuario WHERE usuario_id = ?", [usuario_id], (err, rows) => {
            if (err) {
                return res.status(403).send({ err: err }).end()
            } else {
                bcrypt.compare(senha_antiga, rows[0].usuario_senha)
                    .then((result) => {
                        if (!result) {
                            return res.status(200).send({ err: "Senha incorreta! Por favor, tente novamente" }).end()
                        } else {
                            bcrypt.hash(senha_nova, 10, (errh, hash) => {
                                if (errh) {
                                    return res.status(402).send({ err: errh }).end()
                                } else {
                                    database.query("UPDATE usuario SET usuario_senha = ? WHERE usuario_id = ?", [hash, usuario_id], (err2, rows2) => {
                                        if (err2) {
                                            return res.status(403).send({ err: err2 }).end()
                                        } else {
                                            let newToken = "Bearer " + geraToken({ "id": usuario_id })
                                            return res.status(200).send({
                                                msg: "Ok",
                                                token: newToken
                                            }).end()
                                        }
                                    })
                                }
                            })
                        }
                    });
            }
        })
    }

}

module.exports = controller;