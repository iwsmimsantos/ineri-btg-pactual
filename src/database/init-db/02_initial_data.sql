-- ============================================================================
-- PARTE 1: CRIAÇÃO DAS TABELAS TEMPORÁRIAS PARA IMPORTAÇÃO DOS CSVs
-- ============================================================================

-- Recriar tabela para importar o CSV posicao_intelli
DROP TABLE IF EXISTS posicao_intelli_csv CASCADE;
CREATE TABLE posicao_intelli_csv (
    conta BIGINT,
    financeiro NUMERIC,
    quantidade NUMERIC,
    nome_ativo VARCHAR(255),
    tipo_ativo VARCHAR(255),
    perfil_carteira VARCHAR(255)
);

-- Recriar tabela para importar o CSV recomendacoes_final
DROP TABLE IF EXISTS recomendacoes_final_csv CASCADE;
CREATE TABLE recomendacoes_final_csv (
    conta BIGINT,
    prop_fixa NUMERIC,
    prop_variavel NUMERIC,
    prop_outros NUMERIC,
    nivel_desenquadramento NUMERIC,
    nome_ativo VARCHAR(255),
    score NUMERIC,
    recomendacao_ajuste VARCHAR(255)
);

-- ============================================================================
-- PARTE 2: LIMPEZA E PREPARAÇÃO DO BANCO
-- ============================================================================

-- Apagar dados antigos (exceto tabelas _csv) 
TRUNCATE TABLE recomendacoes, investimento, historico_risco_calculado, historico_risco_declarado, clientes, ativos, assessores RESTART IDENTITY CASCADE;

-- ============================================================================
-- PARTE 3: CRIAÇÃO DE ASSESSORES COM NOMES ÚNICOS E DETERMINÍSTICOS
-- ============================================================================

-- Criar assessores com nomes únicos baseados em sequência determinística
INSERT INTO assessores (nome, email, categoria_assessor, data_criacao, ativo)
SELECT 
    -- Nome determinístico baseado na sequência
    (CASE (gs % 25)
        WHEN 1 THEN 'Roberto' WHEN 2 THEN 'Claudia' WHEN 3 THEN 'Marcos' WHEN 4 THEN 'Sandra' WHEN 5 THEN 'Paulo'
        WHEN 6 THEN 'Helena' WHEN 7 THEN 'José' WHEN 8 THEN 'Vera' WHEN 9 THEN 'Antonio' WHEN 10 THEN 'Silvia'
        WHEN 11 THEN 'Francisco' WHEN 12 THEN 'Regina' WHEN 13 THEN 'Luiz' WHEN 14 THEN 'Angela' WHEN 15 THEN 'Sergio'
        WHEN 16 THEN 'Rosana' WHEN 17 THEN 'Wagner' WHEN 18 THEN 'Adriana' WHEN 19 THEN 'Flavio' WHEN 20 THEN 'Denise'
        WHEN 21 THEN 'Mauro' WHEN 22 THEN 'Eliane' WHEN 23 THEN 'Celso' WHEN 24 THEN 'Marcia' WHEN 0 THEN 'Nelson'
    END) || ' ' || (
    -- Sobrenome determinístico
    CASE ((gs * 11) % 20)
        WHEN 1 THEN 'Silva' WHEN 2 THEN 'Oliveira' WHEN 3 THEN 'Santos' WHEN 4 THEN 'Lima' WHEN 5 THEN 'Pereira'
        WHEN 6 THEN 'Costa' WHEN 7 THEN 'Ferreira' WHEN 8 THEN 'Rodrigues' WHEN 9 THEN 'Almeida' WHEN 10 THEN 'Nascimento'
        WHEN 11 THEN 'Carvalho' WHEN 12 THEN 'Soares' WHEN 13 THEN 'Ribeiro' WHEN 14 THEN 'Moura' WHEN 15 THEN 'Azevedo'
        WHEN 16 THEN 'Teixeira' WHEN 17 THEN 'Machado' WHEN 18 THEN 'Lopes' WHEN 19 THEN 'Vieira' WHEN 0 THEN 'Ramos'
    END) || ' Senior ' || LPAD(gs::text, 3, '0') AS nome,
    
    -- Email único baseado no número sequencial
    'assessor' || LPAD(gs::text, 3, '0') || '@empresa.com' AS email,
    
    -- Categoria determinística baseada no número
    CASE 
        WHEN gs % 3 = 1 THEN 'Junior'
        WHEN gs % 3 = 2 THEN 'Pleno' 
        ELSE 'Senior'
    END AS categoria_assessor,
    
    NOW() - (gs * INTERVAL '30 days') AS data_criacao,
    TRUE AS ativo
FROM generate_series(1, 50) gs;

-- ============================================================================
-- PARTE 4: CRIAÇÃO DE CLIENTES COM DISTRIBUIÇÃO DETERMINÍSTICA DE ASSESSORES
-- ============================================================================

-- Criar clientes com nomes únicos e assessores distribuídos de forma equilibrada
WITH contas_unicas AS (
    SELECT DISTINCT conta, perfil_carteira
    FROM posicao_intelli_csv
),
contas_numeradas AS (
    SELECT 
        conta, 
        perfil_carteira,
        ROW_NUMBER() OVER (ORDER BY conta) as numero_sequencial
    FROM contas_unicas
),
total_assessores AS (
    SELECT COUNT(*) AS total FROM assessores
)
INSERT INTO clientes (nome, email, cpf, data_nascimento, assessor_id, data_criacao, ativo)
SELECT 
    -- Nome único determinístico
    (CASE (cn.numero_sequencial % 50)
        WHEN 1 THEN 'Ana' WHEN 2 THEN 'João' WHEN 3 THEN 'Maria' WHEN 4 THEN 'Pedro' WHEN 5 THEN 'Carlos'
        WHEN 6 THEN 'Fernanda' WHEN 7 THEN 'Ricardo' WHEN 8 THEN 'Juliana' WHEN 9 THEN 'Bruno' WHEN 10 THEN 'Camila'
        WHEN 11 THEN 'Daniel' WHEN 12 THEN 'Larissa' WHEN 13 THEN 'Rafael' WHEN 14 THEN 'Patrícia' WHEN 15 THEN 'André'
        WHEN 16 THEN 'Amanda' WHEN 17 THEN 'Lucas' WHEN 18 THEN 'Mariana' WHEN 19 THEN 'Thiago' WHEN 20 THEN 'Priscila'
        WHEN 21 THEN 'Felipe' WHEN 22 THEN 'Gabriela' WHEN 23 THEN 'Rodrigo' WHEN 24 THEN 'Renata' WHEN 25 THEN 'Marcelo'
        WHEN 26 THEN 'Vanessa' WHEN 27 THEN 'Eduardo' WHEN 28 THEN 'Carolina' WHEN 29 THEN 'Gustavo' WHEN 30 THEN 'Bruna'
        WHEN 31 THEN 'Leonardo' WHEN 32 THEN 'Aline' WHEN 33 THEN 'Diego' WHEN 34 THEN 'Tatiane' WHEN 35 THEN 'Vinicius'
        WHEN 36 THEN 'Cristiane' WHEN 37 THEN 'Fábio' WHEN 38 THEN 'Simone' WHEN 39 THEN 'Alessandro' WHEN 40 THEN 'Monica'
        WHEN 41 THEN 'Roberto' WHEN 42 THEN 'Claudia' WHEN 43 THEN 'Marcos' WHEN 44 THEN 'Sandra' WHEN 45 THEN 'Paulo'
        WHEN 46 THEN 'Helena' WHEN 47 THEN 'José' WHEN 48 THEN 'Vera' WHEN 49 THEN 'Antonio' WHEN 0 THEN 'Silvia'
    END) || ' ' || (
    -- Sobrenome determinístico
    CASE ((cn.numero_sequencial * 7) % 50)
        WHEN 1 THEN 'Silva' WHEN 2 THEN 'Santos' WHEN 3 THEN 'Oliveira' WHEN 4 THEN 'Souza' WHEN 5 THEN 'Lima'
        WHEN 6 THEN 'Costa' WHEN 7 THEN 'Pereira' WHEN 8 THEN 'Almeida' WHEN 9 THEN 'Ribeiro' WHEN 10 THEN 'Carvalho'
        WHEN 11 THEN 'Gomes' WHEN 12 THEN 'Martins' WHEN 13 THEN 'Rocha' WHEN 14 THEN 'Fernandes' WHEN 15 THEN 'Rodrigues'
        WHEN 16 THEN 'Barbosa' WHEN 17 THEN 'Dias' WHEN 18 THEN 'Nascimento' WHEN 19 THEN 'Araújo' WHEN 20 THEN 'Melo'
        WHEN 21 THEN 'Cardoso' WHEN 22 THEN 'Reis' WHEN 23 THEN 'Castro' WHEN 24 THEN 'Nunes' WHEN 25 THEN 'Freitas'
        WHEN 26 THEN 'Campos' WHEN 27 THEN 'Monteiro' WHEN 28 THEN 'Mendes' WHEN 29 THEN 'Moreira' WHEN 30 THEN 'Cavalcanti'
        WHEN 31 THEN 'Ferreira' WHEN 32 THEN 'Soares' WHEN 33 THEN 'Moura' WHEN 34 THEN 'Azevedo' WHEN 35 THEN 'Teixeira'
        WHEN 36 THEN 'Machado' WHEN 37 THEN 'Correia' WHEN 38 THEN 'Lopes' WHEN 39 THEN 'Vieira' WHEN 40 THEN 'Ramos'
        WHEN 41 THEN 'Pinto' WHEN 42 THEN 'Duarte' WHEN 43 THEN 'Morais' WHEN 44 THEN 'Farias' WHEN 45 THEN 'Santana'
        WHEN 46 THEN 'Nogueira' WHEN 47 THEN 'Batista' WHEN 48 THEN 'Tavares' WHEN 49 THEN 'Borges' WHEN 0 THEN 'Miranda'
    END) || ' ' || LPAD(cn.numero_sequencial::text, 4, '0') AS nome,
    
    -- Email único
    'cliente' || LPAD(cn.numero_sequencial::text, 4, '0') || '@mail.com' AS email,
    
    -- CPF único baseado na conta
    LPAD(cn.conta::text, 11, '0') AS cpf,
    
    -- Data de nascimento determinística
    DATE '1970-01-01' + (cn.numero_sequencial * 100)::int * INTERVAL '1 day' AS data_nascimento,
    
    -- DISTRIBUIÇÃO DETERMINÍSTICA DE ASSESSORES
    -- Cada cliente recebe um assessor baseado em sua posição sequencial
    -- Garante distribuição equilibrada entre todos os assessores
    (SELECT id FROM assessores ORDER BY id OFFSET ((cn.numero_sequencial - 1) % ta.total) LIMIT 1) AS assessor_id,
    
    NOW() AS data_criacao,
    TRUE AS ativo
FROM contas_numeradas cn
CROSS JOIN total_assessores ta
ON CONFLICT (cpf) DO NOTHING;

-- ============================================================================
-- PARTE 5: CRIAÇÃO DE ATIVOS
-- ============================================================================

-- Criar ativos com valores plausíveis e determinísticos
INSERT INTO ativos (codigo, nome, tipo, preco_atual, risco, rentabilidade, data_criacao, ativo)
SELECT DISTINCT
    LEFT(TRIM(nome_ativo), 10) AS codigo,
    TRIM(nome_ativo) AS nome,
    TRIM(tipo_ativo) AS tipo,
    -- Preço determinístico baseado no hash do nome do ativo
    ROUND((
        CASE
            WHEN tipo_ativo ILIKE '%ação%' THEN 20 + (ABS(HASHTEXT(nome_ativo)) % 80)
            WHEN tipo_ativo ILIKE '%fii%' THEN 50 + (ABS(HASHTEXT(nome_ativo)) % 150)
            WHEN tipo_ativo ILIKE '%renda fixa%' THEN 100 + (ABS(HASHTEXT(nome_ativo)) % 400)
            ELSE 10 + (ABS(HASHTEXT(nome_ativo)) % 90)
        END
    )::numeric, 2) AS preco_atual,
    -- Risco determinístico
    ROUND((
        CASE
            WHEN tipo_ativo ILIKE '%ação%' THEN (ABS(HASHTEXT(nome_ativo)) % 7) + 3
            WHEN tipo_ativo ILIKE '%fii%' THEN (ABS(HASHTEXT(nome_ativo)) % 4) + 2
            WHEN tipo_ativo ILIKE '%renda fixa%' THEN ABS(HASHTEXT(nome_ativo)) % 2
            ELSE (ABS(HASHTEXT(nome_ativo)) % 5) + 1
        END
    )::numeric, 2) AS risco,
    -- Rentabilidade determinística
    ROUND((
        CASE
            WHEN tipo_ativo ILIKE '%ação%' THEN (ABS(HASHTEXT(nome_ativo)) % 12) + 3
            WHEN tipo_ativo ILIKE '%fii%' THEN (ABS(HASHTEXT(nome_ativo)) % 10) + 2
            WHEN tipo_ativo ILIKE '%renda fixa%' THEN (ABS(HASHTEXT(nome_ativo)) % 5) + 1
            ELSE (ABS(HASHTEXT(nome_ativo)) % 8) + 2
        END
    )::numeric, 2) AS rentabilidade,
    NOW() AS data_criacao,
    TRUE AS ativo
FROM posicao_intelli_csv
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================================
-- PARTE 6: CRIAÇÃO DE INVESTIMENTOS
-- ============================================================================

-- Criar investimentos
INSERT INTO investimento (cliente_id, ativo_id, quantidade, preco_compra, data_compra, data_criacao)
SELECT
    cl.id,
    atv.id,
    p.quantidade,
    ROUND((p.financeiro / NULLIF(p.quantidade, 0))::numeric, 2),
    NOW() - ((ABS(HASHTEXT(cl.cpf)) % 730) * INTERVAL '1 day'), -- Data determinística entre 0-2 anos
    NOW()
FROM posicao_intelli_csv p
JOIN clientes cl ON LPAD(p.conta::text, 11, '0') = cl.cpf
JOIN ativos atv ON TRIM(p.nome_ativo) = atv.nome;

-- ============================================================================
-- PARTE 7: HISTÓRICO DE RISCO DECLARADO
-- ============================================================================

-- Criar histórico de risco declarado (perfil da carteira)
INSERT INTO historico_risco_declarado (cliente_id, risco_declarado, respostas_questionario, data_declaracao)
SELECT
    c.id,
    CASE LOWER(TRIM(p.perfil_carteira))
        WHEN 'conservador' THEN 1
        WHEN 'moderado' THEN 2
        WHEN 'arrojado' THEN 3
        ELSE 2
    END,
    jsonb_build_object('perfil', p.perfil_carteira),
    NOW() - ((ABS(HASHTEXT(c.cpf)) % 365) * INTERVAL '1 day') -- Data determinística no último ano
FROM posicao_intelli_csv p
JOIN clientes c ON LPAD(p.conta::text, 11, '0') = c.cpf;

-- ============================================================================
-- PARTE 8: HISTÓRICO DE RISCO CALCULADO
-- ============================================================================

-- Criar histórico de risco calculado
INSERT INTO historico_risco_calculado (cliente_id, risco_calculado, dados_calculo, data_calculo)
SELECT
    c.id,
    CASE
        WHEN r.nivel_desenquadramento < 0.3 THEN 1
        WHEN r.nivel_desenquadramento < 0.6 THEN 2
        ELSE 3
    END,
    jsonb_build_object(
        'nivel_desenquadramento', r.nivel_desenquadramento,
        'proporcoes', jsonb_build_object(
            'fixa', r.prop_fixa,
            'variavel', r.prop_variavel,
            'outros', r.prop_outros
        )
    ),
    NOW() - ((ABS(HASHTEXT(c.cpf)) % 180) * INTERVAL '1 day') -- Data determinística nos últimos 6 meses
FROM recomendacoes_final_csv r
JOIN clientes c ON LPAD(r.conta::text, 11, '0') = c.cpf;

-- ============================================================================
-- PARTE 9: RECOMENDAÇÕES
-- ============================================================================

-- Inserir recomendações
INSERT INTO recomendacoes (cliente_id, ativo_id, descricao, quantidade_sugerida, status_recomendacao, data_criacao, data_atualizacao)
SELECT
    c.id,
    a.id,
    r.recomendacao_ajuste,
    ROUND((
        (p.financeiro / NULLIF(a.preco_atual, 0)) * 
        CASE LOWER(TRIM(p.perfil_carteira))
            WHEN 'conservador' THEN 0.8
            WHEN 'moderado' THEN 1.0
            WHEN 'arrojado' THEN 1.2
            ELSE 1.0
        END
    )::numeric, 2),
    'pendente',
    NOW(),
    NULL
FROM recomendacoes_final_csv r
JOIN clientes c ON LPAD(r.conta::text, 11, '0') = c.cpf
JOIN ativos a ON TRIM(r.nome_ativo) = a.nome
JOIN posicao_intelli_csv p ON r.conta = p.conta AND r.nome_ativo = p.nome_ativo;

-- ============================================================================
-- PARTE 10: VERIFICAÇÕES FINAIS
-- ============================================================================

-- Verificação de distribuição de assessores
DO $$
DECLARE
    total_clientes INTEGER;
    total_assessores INTEGER;
    min_clientes_por_assessor INTEGER;
    max_clientes_por_assessor INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_clientes FROM clientes;
    SELECT COUNT(*) INTO total_assessores FROM assessores;
    
    SELECT MIN(total), MAX(total) 
    INTO min_clientes_por_assessor, max_clientes_por_assessor
    FROM (
        SELECT assessor_id, COUNT(*) as total 
        FROM clientes 
        GROUP BY assessor_id
    ) dist;
    
    RAISE NOTICE '📊 DISTRIBUIÇÃO DE ASSESSORES:';
    RAISE NOTICE '   Total de clientes: %', total_clientes;
    RAISE NOTICE '   Total de assessores: %', total_assessores;
    RAISE NOTICE '   Clientes por assessor (min/max): % / %', min_clientes_por_assessor, max_clientes_por_assessor;
    RAISE NOTICE '   Diferença máxima: %', max_clientes_por_assessor - min_clientes_por_assessor;
    
    IF (max_clientes_por_assessor - min_clientes_por_assessor) <= 1 THEN
        RAISE NOTICE '✅ DISTRIBUIÇÃO EQUILIBRADA!';
    ELSE
        RAISE NOTICE '⚠️  Distribuição pode ser melhorada';
    END IF;
END $$;

-- Verificação de nomes únicos
DO $$
DECLARE
    duplicatas_clientes INTEGER;
    duplicatas_assessores INTEGER;
BEGIN
    SELECT COUNT(*) INTO duplicatas_clientes
    FROM (SELECT nome, COUNT(*) FROM clientes GROUP BY nome HAVING COUNT(*) > 1) dup;
    
    SELECT COUNT(*) INTO duplicatas_assessores
    FROM (SELECT nome, COUNT(*) FROM assessores GROUP BY nome HAVING COUNT(*) > 1) dup;
    
    RAISE NOTICE '🔍 VERIFICAÇÃO DE UNICIDADE:';
    RAISE NOTICE '   Duplicatas em clientes: %', duplicatas_clientes;
    RAISE NOTICE '   Duplicatas em assessores: %', duplicatas_assessores;
    
    IF duplicatas_clientes = 0 AND duplicatas_assessores = 0 THEN
        RAISE NOTICE '✅ TODOS OS NOMES SÃO ÚNICOS!';
    ELSE
        RAISE NOTICE '❌ ENCONTRADAS DUPLICATAS!';
    END IF;
END $$;

-- Verificação final de consistência
DO $$
BEGIN
    RAISE NOTICE '📋 RESUMO FINAL:';
    RAISE NOTICE '   Assessores criados: %', (SELECT COUNT(*) FROM assessores);
    RAISE NOTICE '   Clientes criados: %', (SELECT COUNT(*) FROM clientes);
    RAISE NOTICE '   Ativos criados: %', (SELECT COUNT(*) FROM ativos);
    RAISE NOTICE '   Investimentos criados: %', (SELECT COUNT(*) FROM investimento);
    RAISE NOTICE '   Recomendações criadas: %', (SELECT COUNT(*) FROM recomendacoes);
    RAISE NOTICE '✅ SCRIPT EXECUTADO COM SUCESSO!';
END $$;