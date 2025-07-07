EXPLAIN ANALYZE
WITH ultimo_risco AS (
    SELECT DISTINCT ON (cliente_id) 
        cliente_id, 
        risco_declarado
    FROM historico_risco_declarado
    ORDER BY cliente_id, data_declaracao DESC
)
SELECT 
    c.nome,
    ur.risco_declarado,
    SUM(i.quantidade * at.preco_atual) as patrimonio_total
FROM clientes c
JOIN ultimo_risco ur ON c.id = ur.cliente_id
JOIN investimento i ON c.id = i.cliente_id
JOIN ativos at ON i.ativo_id = at.id
WHERE ur.risco_declarado BETWEEN 3 AND 5
GROUP BY c.id, c.nome, ur.risco_declarado
HAVING SUM(i.quantidade * at.preco_atual) > 10000
ORDER BY patrimonio_total DESC;