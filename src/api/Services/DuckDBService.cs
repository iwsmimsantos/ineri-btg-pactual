using DuckDB.NET.Data;
using INERI.API.Models;

namespace INERI.API.Services;

public interface IDuckDBService
{
    Task<RecommendationResponse> GetRecommendationsAsync(int conta);
}

public class DuckDBService : IDuckDBService
{
    private readonly string _connectionString;
    private readonly ILogger<DuckDBService> _logger;
    private readonly string _parquetPath;

    public DuckDBService(IConfiguration configuration, ILogger<DuckDBService> logger)
    {
        _connectionString = configuration.GetConnectionString("DuckDB") ?? "Data Source=:memory:";
        _logger = logger;
        _parquetPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "recomendacoes.parquet");
    }

    private async Task InitializeDatabaseAsync(DuckDBConnection connection)
    {
        // Cria uma view temporária a partir do arquivo parquet
        var createViewQuery = $@"
            CREATE OR REPLACE VIEW recomendacoes AS
            SELECT * FROM read_parquet('{_parquetPath}')";

        using var command = new DuckDBCommand(createViewQuery, connection);
        await command.ExecuteNonQueryAsync();
    }

    public async Task<RecommendationResponse> GetRecommendationsAsync(int conta)
    {
        try
        {
            using var connection = new DuckDBConnection(_connectionString);
            await connection.OpenAsync();

            // Inicializa o banco com a view do parquet
            await InitializeDatabaseAsync(connection);

            // Query para obter as proporções e recomendações
            var query = @"
                WITH first_row AS (
                    SELECT
                        prop_fixa,
                        prop_variavel,
                        prop_outros,
                        ROUND(nivel_desenquadramento * 10, 3) as nivel_desenquadramento,
                        recomendacao_ajuste
                    FROM recomendacoes
                    WHERE conta = $1
                    LIMIT 1
                ),
                top_ativos AS (
                    SELECT
                        nome_ativo,
                        score
                    FROM recomendacoes
                    WHERE conta = $1
                    AND nome_ativo NOT IN ('prop_Renda Fixa', 'prop_Renda Variável')
                    ORDER BY score DESC
                    LIMIT 5
                )
                SELECT
                    f.prop_fixa,
                    f.prop_variavel,
                    f.prop_outros,
                    f.nivel_desenquadramento,
                    t.nome_ativo,
                    t.score,
                    f.recomendacao_ajuste
                FROM first_row f
                CROSS JOIN top_ativos t
                ORDER BY t.score DESC";

            using var command = new DuckDBCommand(query, connection);
            command.Parameters.Add(new DuckDBParameter { Value = conta });

            using var reader = await command.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                throw new Exception($"A conta {conta} não existe");
            }

            var response = new RecommendationResponse
            {
                PropFixa = reader.GetDouble(0),
                PropVariavel = reader.GetDouble(1),
                PropOutros = reader.GetDouble(2),
                NivelDesenquadramento = reader.GetDouble(3),
                RecomendacaoAjuste = reader.GetString(6)
            };

            // Adiciona o primeiro ativo
            response.AtivosRecomendados.Add(new AtivoRecomendado
            {
                Nome = reader.GetString(4),
                Score = reader.GetDouble(5)
            });

            // Lê os próximos ativos (agora serão no máximo 4, já que o primeiro já foi lido)
            while (await reader.ReadAsync())
            {
                response.AtivosRecomendados.Add(new AtivoRecomendado
                {
                    Nome = reader.GetString(4),
                    Score = reader.GetDouble(5)
                });
            }

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao obter recomendações do DuckDB");
            throw;
        }
    }
}
