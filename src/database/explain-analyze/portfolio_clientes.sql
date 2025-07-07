EXPLAIN ANALYZE
SELECT 
    c.nome as cliente,
    at.codigo,
    at.nome as ativo_nome,
    i.quantidade,
    i.preco_compra,
    at.preco_atual,
    (i.quantidade * at.preco_atual) as valor_atual
FROM clientes c
JOIN investimento i ON c.id = i.cliente_id
JOIN ativos at ON i.ativo_id = at.id
WHERE c.id = 1;