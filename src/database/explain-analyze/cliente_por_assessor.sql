EXPLAIN ANALYZE
SELECT c.*, a.nome as assessor_nome 
FROM clientes c
JOIN assessores a ON c.assessor_id = a.id
WHERE a.id = 1 AND c.ativo = true;