EXPLAIN ANALYZE
SELECT 
    at.codigo,
    at.nome,
    COUNT(DISTINCT i.cliente_id) as investidores,
    SUM(i.quantidade) as quantidade_total,
    AVG(i.preco_compra) as preco_medio_compra
FROM ativos at
JOIN investimento i ON at.id = i.ativo_id
WHERE at.ativo = true
GROUP BY at.id, at.codigo, at.nome
ORDER BY investidores DESC;