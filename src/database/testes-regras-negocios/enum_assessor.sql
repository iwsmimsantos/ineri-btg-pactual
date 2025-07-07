BEGIN;
SAVEPOINT inicio_teste_enum;

DO $$
DECLARE
    exception_raised BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE '=== INICIANDO TESTE: Validação de ENUM - Categoria Assessor ===';
    
    -- TESTE 1: Categoria válida 'Gold' (deve funcionar)
    BEGIN
        INSERT INTO assessores (nome, email, categoria_assessor, data_criacao, ativo)
        VALUES ('Assessor Gold', 'gold@teste.com', 'Gold', NOW(), TRUE);
        RAISE NOTICE 'SUCESSO: Categoria "Gold" aceita';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'ERRO: Categoria válida "Gold" rejeitada - %', SQLERRM;
    END;
    
    -- TESTE 2: Categoria válida 'Prata' (deve funcionar)
    BEGIN
        INSERT INTO assessores (nome, email, categoria_assessor, data_criacao, ativo)
        VALUES ('Assessor Prata', 'prata@teste.com', 'Prata', NOW(), TRUE);
        RAISE NOTICE 'SUCESSO: Categoria "Prata" aceita';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'ERRO: Categoria válida "Prata" rejeitada - %', SQLERRM;
    END;
    
    -- TESTE 3: Categoria válida 'Platinum' (deve funcionar)
    BEGIN
        INSERT INTO assessores (nome, email, categoria_assessor, data_criacao, ativo)
        VALUES ('Assessor Platinum', 'platinum@teste.com', 'Platinum', NOW(), TRUE);
        RAISE NOTICE 'SUCESSO: Categoria "Platinum" aceita';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'ERRO: Categoria válida "Platinum" rejeitada - %', SQLERRM;
    END;
    
    RAISE NOTICE '=== TESTE CONCLUÍDO - DADOS SERÃO REVERTIDOS ===';
    RAISE NOTICE '';
END;
$$;

ROLLBACK TO SAVEPOINT inicio_teste_enum;
COMMIT;