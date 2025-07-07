\set cliente_id random(1, 6000)
\set risco_calculado random(1, 30000)
INSERT INTO historico_risco_calculado (cliente_id, risco_calculado, dados_calculo, data_calculo)
SELECT
    :cliente_id,
    :risco_calculado,
    FORMAT('{"perfil_calculado": "Teste_%s", "concentracao_rv": %s, "concentracao_rf": %s, "concentracao_fii": %s, "volatilidade_carteira": %s, "timestamp": "%s"}', 
           :risco_calculado, 
           (random() * 0.8)::numeric(3,2), 
           (random() * 0.6)::numeric(3,2),
           (random() * 0.4)::numeric(3,2),
           (random() * 15 + 2)::numeric(4,1),
           NOW()::text)::jsonb,
    NOW()
FROM clientes c
WHERE c.id = :cliente_id
LIMIT 1;