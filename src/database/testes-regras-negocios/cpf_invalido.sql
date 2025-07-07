BEGIN;
SAVEPOINT inicio_teste_cpf;

DO $$
DECLARE
    test_assessor_id INT;
    test_cliente_id INT;
    exception_raised BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE '=== INICIANDO TESTE: Validação de CPF ===';
    
    -- Criar assessor para teste
    INSERT INTO assessores (nome, email, categoria_assessor, data_criacao, ativo)
    VALUES ('Assessor CPF Teste', 'cpf@teste.com', 'Gold', NOW(), TRUE)
    RETURNING id INTO test_assessor_id;
    
   BEGIN
        INSERT INTO clientes (nome, email, cpf, data_nascimento, assessor_id, data_criacao, ativo)
        VALUES ('Cliente CPF Curto', 'cpfcurto@teste.com', '123456789', '1990-01-01', test_assessor_id, NOW(), TRUE);
        RAISE NOTICE 'ERRO: CPF curto foi aceito!';
    EXCEPTION
        WHEN OTHERS THEN
            exception_raised := TRUE;
            RAISE NOTICE 'SUCESSO: CPF curto rejeitado - %', SQLERRM;
    END;
END;
$$;

ROLLBACK TO SAVEPOINT inicio_teste_cpf;
COMMIT;