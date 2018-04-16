DROP DATABASE IF EXISTS qrcontest;
CREATE DATABASE qrcontest;
USE qrcontest;

CREATE TABLE question (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  question TEXT,
  imageurl TEXT,
  answera  TEXT,
  answerb  TEXT,
  answerc  TEXT,
  answerd  TEXT,
  answer   INT,
  points   INT
)
  DEFAULT CHARSET = utf8;

CREATE TABLE qr (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        TEXT,
  data        TEXT,
  url         TEXT,
  value       INT,
  type        INT,
  description TEXT,
  active      INT
)
  DEFAULT CHARSET = utf8;

CREATE TABLE users (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  name           TEXT,
  login          TEXT,
  class          TEXT,
  password       TEXT,
  points         INT,
  signuptime     DATETIME,
  lastonlinetime DATETIME,
  type           INT
)
  DEFAULT CHARSET = utf8;

CREATE TABLE user_qr (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT,
  id_qr   INT,
  time    DATETIME,
  CONSTRAINT fk_qr_user FOREIGN KEY (id_user) REFERENCES users (id),
  CONSTRAINT fk_qr_qr FOREIGN KEY (id_qr) REFERENCES qr (id)
)
  DEFAULT CHARSET = utf8;

CREATE TABLE user_question (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  id_user     INT,
  id_question INT,
  time        DATETIME,
  answer      INT,
  correct     INT,
  CONSTRAINT fk_question_user FOREIGN KEY (id_user) REFERENCES users (id),
  CONSTRAINT fk_question_question FOREIGN KEY (id_question) REFERENCES question (id)
)
  DEFAULT CHARSET = utf8;

CREATE TABLE contest_params (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  param TEXT
)
  DEFAULT CHARSET = utf8;

INSERT INTO users (`id`, `name`, `login`, `class`, `password`, `points`, `signuptime`, `lastonlinetime`, `type`) VALUES (NULL, 'Roman', 'TypowyRoman', '4TI', '$2y$10$410ehabvJ2J5AWrtO2wWCuTCGblDCTNtDVw/O0qCO4RPTA.oBlvK.', '0', NOW(), NOW(), '1');
INSERT INTO contest_params (`param`) VALUES ('0'), ('Szukaj...');


