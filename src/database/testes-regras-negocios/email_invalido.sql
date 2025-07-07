BEGIN;
SAVEPOINT inicio_teste_email;

DO $$
DECLARE
    exception_raised BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE '=== INICIANDO TESTE: Validação de Email ===';
    
    BEGIN
        INSERT INTO assessores (nome, email, categoria_assessor, data_criacao, ativo)
        VALUES ('Assessor Email Sem @', 'emailsemarroba.com', 'Gold', NOW(), TRUE);
        RAISE NOTICE 'ERRO: Email sem @ foi aceito!';
    EXCEPTION
        WHEN OTHERS THEN
            exception_raised := TRUE;
            RAISE NOTICE 'SUCESSO: Email sem @ rejeitado - %', SQLERRM;
    END;
END;
$$;

ROLLBACK TO SAVEPOINT inicio_teste_email;
COMMIT;