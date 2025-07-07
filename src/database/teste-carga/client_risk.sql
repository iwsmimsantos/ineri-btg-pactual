\set cliente_id random(1, 6000)
SELECT 
    c.nome,
    hrd.risco_declarado,
    hrd.respostas_questionario,
    hrc.risco_calculado,
    hrc.dados_calculo,
    CASE 
        WHEN ABS(hrd.risco_declarado - hrc.risco_calculado) <= 1 THEN 'ALINHADO'
        WHEN hrd.risco_declarado > hrc.risco_calculado THEN 'RISCO_ALTO_DECLARADO'
        ELSE 'RISCO_ALTO_CALCULADO'
    END as status_risco
FROM clientes c
LEFT JOIN historico_risco_declarado hrd ON c.id = hrd.cliente_id
LEFT JOIN historico_risco_calculado hrc ON c.id = hrc.cliente_id
WHERE c.id = :cliente_id
ORDER BY hrd.data_declaracao DESC, hrc.data_calculo DESC
LIMIT 1;