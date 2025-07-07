BEGIN;
SAVEPOINT inicio_teste_integridade;

DO $$
DECLARE
    exception_raised BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE '=== INICIANDO TESTE: Integridade Referencial ===';
    
    -- TESTE 1: Tentar criar cliente com assessor inexistente (deve falhar)
    BEGIN
        INSERT INTO clientes (nome, email, cpf, data_nascimento, assessor_id, data_criacao, ativo)
        VALUES ('Cliente Órfão', 'orfao@teste.com', '99988877701', '1990-01-01', 99999, NOW(), TRUE);
        RAISE NOTICE 'ERRO: Cliente foi criado com assessor inexistente!';
    EXCEPTION
        WHEN OTHERS THEN
            exception_raised := TRUE;
            RAISE NOTICE 'SUCESSO: Criação de cliente com assessor inexistente foi bloqueada - %', SQLERRM;
    END;
end;
$$;

ROLLBACK TO SAVEPOINT inicio_teste_integridade;
COMMIT;