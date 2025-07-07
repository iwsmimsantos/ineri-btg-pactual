EXPLAIN ANALYZE
SELECT 
    a.nome,
    COUNT(DISTINCT c.id) as total_clientes,
    SUM(i.quantidade * at.preco_atual) as volume_total
FROM assessores a
JOIN clientes c ON a.id = c.assessor_id
JOIN investimento i ON c.id = i.cliente_id
JOIN ativos at ON i.ativo_id = at.id
WHERE a.ativo = true
GROUP BY a.id, a.nome
ORDER BY volume_total DESC;