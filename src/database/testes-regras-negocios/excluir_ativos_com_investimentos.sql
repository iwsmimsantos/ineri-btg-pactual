BEGIN;
SAVEPOINT inicio_teste_ativo;

DO $$
DECLARE
    test_ativo_id INT;
    test_cliente_id INT;
    test_assessor_id INT;
    exception_raised BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE '=== INICIANDO TESTE: Proteção Ativo com Investimentos ===';
    
    -- Criar dados necessários
    INSERT INTO assessores (nome, email, categoria_assessor, data_criacao, ativo)
    VALUES ('Assessor Teste 3', 'assessor3@teste.com', 'Platinum', NOW(), TRUE)
    RETURNING id INTO test_assessor_id;
    
    INSERT INTO clientes (nome, email, cpf, data_nascimento, assessor_id, data_criacao, ativo)
    VALUES ('Cliente Teste 3', 'cliente3@teste.com', '11122233301', '1992-12-25', test_assessor_id, NOW(), TRUE)
    RETURNING id INTO test_cliente_id;
    
    INSERT INTO ativos (codigo, nome, tipo, preco_atual, risco, rentabilidade, data_criacao, ativo)
    VALUES ('TEST02', 'Ativo Teste 2', 'FII', 50.00, 3.0, 8.0, NOW(), TRUE)
    RETURNING id INTO test_ativo_id;
    
    -- Criar investimento
    INSERT INTO investimento (cliente_id, ativo_id, quantidade, preco_compra, data_compra, data_criacao)
    VALUES (test_cliente_id, test_ativo_id, 20.0, 50.00, NOW(), NOW());
    
    RAISE NOTICE 'Dados criados - Ativo ID: %, Cliente ID: %', test_ativo_id, test_cliente_id;
    
    -- TESTE 1: Tentar excluir ativo COM investimentos (deve falhar)
    BEGIN
        DELETE FROM ativos WHERE id = test_ativo_id;
        RAISE NOTICE 'ERRO: Ativo foi excluído mesmo estando em investimentos!';
    EXCEPTION
        WHEN OTHERS THEN
            exception_raised := TRUE;
            RAISE NOTICE 'SUCESSO: Exclusão bloqueada corretamente - %', SQLERRM;
    end;
END;
$$;

ROLLBACK TO SAVEPOINT inicio_teste_ativo;
COMMIT;