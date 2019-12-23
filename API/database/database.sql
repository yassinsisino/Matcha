
DROP SCHEMA IF EXISTS matcha;
CREATE SCHEMA IF NOT EXISTS matcha;

DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "matches" CASCADE;
DROP TABLE IF EXISTS "likes" CASCADE;
DROP TABLE IF EXISTS "visits" CASCADE;
DROP TABLE IF EXISTS "tags" CASCADE;

SET timezone = 'europe/paris';
CREATE TYPE genre AS ENUM ('M', 'W', 'O');
CREATE TYPE orientations AS ENUM ('M', 'W', 'BI');

CREATE TABLE IF NOT EXISTS users (
    idUser SERIAL PRIMARY KEY, 
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    dateOfBirth DATE,
    mail VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio VARCHAR(500),
    gender genre DEFAULT 'O',
    orientation orientations DEFAULT 'BI',
    score SMALLINT DEFAULT 0,
    active BOOLEAN DEFAULT 'F',
    complete BOOLEAN DEFAULT 'F',
    mailNotification BOOLEAN DEFAULT 'T',
    activationKey VARCHAR(255),
    restoreKey VARCHAR(255),
    connexionLog TIMESTAMP DEFAULT NOW(),
    location JSON,
    photos JSON
);

CREATE TABLE IF NOT EXISTS likes (
    idLike SERIAL PRIMARY KEY,
    idUser INTEGER NOT NULL REFERENCES users(idUser),
    likedIdUser INTEGER NOT NULL REFERENCES users(idUser),
    likedDate TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visits (
    idVisite SERIAL PRIMARY KEY,
    idUser INTEGER NOT NULL REFERENCES users(idUser),
    visitedIdUser INTEGER NOT NULL REFERENCES users(idUser),
    visitedDate TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
    idMatch SERIAL PRIMARY KEY,
    idUser1 INTEGER NOT NULL REFERENCES users(idUser),
    idUser2 INTEGER NOT NULL REFERENCES users(idUser),
    matchedDate TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
    idTag SERIAL PRIMARY KEY,
    tag VARCHAR(20) NOT NULL,
    idUser INTEGER NOT NULL REFERENCES users(idUser)
);