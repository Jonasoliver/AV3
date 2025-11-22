CREATE TABLE IF NOT EXISTS funcionarios (
  id VARCHAR(8) PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  telefone VARCHAR(40),
  endereco VARCHAR(255),
  usuario VARCHAR(60) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nivel_permissao ENUM('ADMINISTRADOR','ENGENHEIRO','OPERADOR') NOT NULL
);

CREATE TABLE IF NOT EXISTS aeronaves (
  codigo VARCHAR(8) PRIMARY KEY,
  modelo VARCHAR(120) NOT NULL,
  tipo ENUM('COMERCIAL','MILITAR') NOT NULL,
  capacidade INT,
  alcance INT
);

CREATE TABLE IF NOT EXISTS pecas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aeronave_codigo VARCHAR(8) NOT NULL,
  nome VARCHAR(120) NOT NULL,
  tipo ENUM('NACIONAL','IMPORTADA') NOT NULL,
  fornecedor VARCHAR(120),
  status ENUM('EM_PRODUCAO','EM_TRANSPORTE','PRONTA') NOT NULL,
  FOREIGN KEY (aeronave_codigo) REFERENCES aeronaves(codigo) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS etapas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aeronave_codigo VARCHAR(8) NOT NULL,
  nome VARCHAR(120) NOT NULL,
  prazo VARCHAR(80),
  status ENUM('PENDENTE','ANDAMENTO','CONCLUIDA') NOT NULL,
  ordem INT NOT NULL,
  FOREIGN KEY (aeronave_codigo) REFERENCES aeronaves(codigo) ON DELETE CASCADE,
  UNIQUE KEY unique_ordem (aeronave_codigo, ordem)
);

CREATE TABLE IF NOT EXISTS etapas_funcionarios (
  etapa_id INT NOT NULL,
  funcionario_id VARCHAR(8) NOT NULL,
  PRIMARY KEY (etapa_id, funcionario_id),
  FOREIGN KEY (etapa_id) REFERENCES etapas(id) ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS testes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aeronave_codigo VARCHAR(8) NOT NULL,
  tipo ENUM('ELETRICO','HIDRAULICO','AERODINAMICO') NOT NULL,
  resultado ENUM('APROVADO','REPROVADO') NOT NULL,
  FOREIGN KEY (aeronave_codigo) REFERENCES aeronaves(codigo) ON DELETE CASCADE
);
