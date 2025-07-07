
\set cliente_id random(1, 6000)
SELECT 
    c.nome as cliente_nome,
    c.email,
    a.nome as assessor_nome,
    a.categoria_assessor,
    COUNT(i.id) as total_investimentos,
    COALESCE(SUM(i.quantidade * at.preco_atual), 0) as valor_total_portfolio,
    ARRAY_AGG(DISTINCT at.tipo) as tipos_ativos
FROM clientes c
JOIN assessores a ON c.assessor_id = a.id
LEFT JOIN investimento i ON c.id = i.cliente_id
LEFT JOIN ativos at ON i.ativo_id = at.id
WHERE c.id = :cliente_id AND c.ativo = true
GROUP BY c.id, c.nome, c.email, a.nome, a.categoria_assessor;