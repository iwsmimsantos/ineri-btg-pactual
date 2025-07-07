BEGIN;
SAVEPOINT inicio_teste_integridade;

DO $$
DECLARE
    exception_raised BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE '=== INICIANDO TESTE: Integridade Referencial ===';
    
    BEGIN
        INSERT INTO investimento (cliente_id, ativo_id, quantidade, preco_compra, data_compra, data_criacao)
        VALUES (99999, 1, 10.0, 100.00, NOW(), NOW());
        RAISE NOTICE 'ERRO: Investimento foi criado com cliente inexistente!';
    EXCEPTION
        WHEN OTHERS THEN
            exception_raised := TRUE;
            RAISE NOTICE 'SUCESSO: Criação de investimento com cliente inexistente foi bloqueada - %', SQLERRM;
    END;
END;
$$;

ROLLBACK TO SAVEPOINT inicio_teste_integridade;
COMMIT;