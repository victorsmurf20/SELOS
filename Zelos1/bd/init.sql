    create database if not exists zelos;
    use zelos;
    -- Criação da tabela `usuarios`
    CREATE TABLE usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        senha VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        funcao ENUM('admin', 'tecnico', 'usuario') NOT NULL,
        status ENUM('ativo', 'inativo') DEFAULT 'ativo',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    -- Criação da tabela `pool`
    CREATE TABLE pool (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo ENUM('externo', 'manutencao', 'apoio_tecnico', 'limpeza') NOT NULL,
        descricao TEXT,
        status ENUM('ativo', 'inativo') DEFAULT 'ativo',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT,
        updated_by INT,
        FOREIGN KEY (created_by) REFERENCES usuarios(id),
        FOREIGN KEY (updated_by) REFERENCES usuarios(id)
    );

    -- Criação da tabela `chamados`
    CREATE TABLE chamados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        numero_patrimonio Varchar(50),
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        tipo_id INT not null,
        tecnico_id INT not null,
        usuario_id INT not null,
        status ENUM('aberto', 'em andamento', 'aguardando aprovacao', 'concluído') DEFAULT 'aberto',
        resolucao TEXT,
        data_fechamento timestamp null,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tipo_id) REFERENCES pool(id),
        FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        constraint zl_chamado_unico UNIQUE (numero_patrimonio, tipo_id, status)
        
    );

    -- Criação da tabela `apontamentos`
    CREATE TABLE apontamentos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chamado_id INT not null,
        tecnico_id INT not null,
        descricao TEXT,
        comeco DATETIME NOT NULL,
        fim DATETIME NOT NULL,
        duracao INT AS (TIMESTAMPDIFF(SECOND, comeco, fim)) STORED, -- Calcula a duração em segundos
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chamado_id) REFERENCES chamados(id),
        FOREIGN KEY (tecnico_id) REFERENCES usuarios(id)
    );

    -- Criação da tabela `pool_tecnico`
    CREATE TABLE pool_tecnico (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_pool INT not null,
        id_tecnico INT not null,
        FOREIGN KEY (id_pool) REFERENCES pool(id),
        FOREIGN KEY (id_tecnico) REFERENCES usuarios(id)
    );

    -- Índices adicionais para otimização
    CREATE INDEX idx_usuarios_email ON usuarios(email);
    CREATE INDEX idx_chamados_status ON chamados(status);
    create index idx_chamados_patrimonio ON chamados(numero_patrimonio);
    CREATE INDEX idx_apontamentos_comeco_fim ON apontamentos(comeco, fim);
