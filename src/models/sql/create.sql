CREATE DATABASE IF NOT EXISTS db_tcc;
USE db_tcc;

CREATE TABLE IF NOT EXISTS usuario (
    usuario_id INT NOT NULL AUTO_INCREMENT,
    
    usuario_tipo VARCHAR(32) NOT NULL,
    usuario_login VARCHAR(160) NOT NULL,
    usuario_senha VARCHAR(160) NOT NULL,
    usuario_nome VARCHAR(160) NOT NULL,
    usuario_cpf VARCHAR(160) NOT NULL,
    usuario_nascimento DATE NOT NULL,
    usuario_telefone VARCHAR(160) NOT NULL,    
    usuario_email VARCHAR(160),
    usuario_ficha VARCHAR(30),
    usuario_status INT NOT NULL DEFAULT 1,
    

    CONSTRAINT pk_user
        PRIMARY KEY(usuario_id)
);

CREATE TABLE IF NOT EXISTS procedimento (
    procedimento_id INT NOT NULL AUTO_INCREMENT,   
    procedimento_titulo VARCHAR(240) NOT NULL,
    procedimento_desc VARCHAR(320) NOT NULL,
    procedimento_data DATETIME NOT NULL,
    procedimento_status INT NOT NULL DEFAULT 1,
    procedimento_cliente INT,

    CONSTRAINT pk_procedimento
        PRIMARY KEY(procedimento_id)
);

CREATE TABLE IF NOT EXISTS blog (
    blog_id INT NOT NULL AUTO_INCREMENT,
    blog_titulo VARCHAR(240) NOT NULL,
    blog_desc VARCHAR(400) NOT NULL,
    blog_desc_full LONGTEXT NOT NULL,
    blog_data DATETIME NOT NULL,
    blog_home INT DEFAULT 0,

    CONSTRAINT pk_blog
        PRIMARY KEY(blog_id)
);

