BEGIN;
SAVEPOINT inicio_teste_assessor;

DO $$
DECLARE
    test_assessor_id INT;
    test_cliente_id INT;
    exception_raised BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE '=== INICIANDO TESTE: Proteção Assessor com Clientes ===';
    
    -- Criar assessor
    INSERT INTO assessores (nome, email, categoria_assessor, data_criacao, ativo)
    VALUES ('Assessor Teste 2', 'assessor2@teste.com', 'Prata', NOW(), TRUE)
    RETURNING id INTO test_assessor_id;
    
    -- Criar cliente vinculado ao assessor  
    INSERT INTO clientes (nome, email, cpf, data_nascimento, assessor_id, data_criacao, ativo)
    VALUES ('Cliente Teste 2', 'cliente2@teste.com', '98765432101', '1985-05-15', test_assessor_id, NOW(), TRUE)
    RETURNING id INTO test_cliente_id;
    
    RAISE NOTICE 'Dados criados - Assessor ID: %, Cliente ID: %', test_assessor_id, test_cliente_id;
    
    -- TESTE 1: Tentar excluir assessor COM clientes (deve falhar)
    BEGIN
        DELETE FROM assessores WHERE id = test_assessor_id;
        RAISE NOTICE 'ERRO: Assessor foi excluído mesmo tendo clientes!';
    EXCEPTION
        WHEN OTHERS THEN
            exception_raised := TRUE;
            RAISE NOTICE 'SUCESSO: Exclusão bloqueada corretamente - %', SQLERRM;
    END;
end;
$$;
ROLLBACK TO SAVEPOINT inicio_teste_assessor;
COMMIT;
