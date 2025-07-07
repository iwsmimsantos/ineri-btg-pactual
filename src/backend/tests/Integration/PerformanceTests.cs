using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using Xunit;
using Xunit.Abstractions;
using INERI.Backend.Models;
using Microsoft.EntityFrameworkCore; 

namespace INERI.Backend.Data;

public class PerformanceTests : IntegrationTestBase
{
    private readonly ITestOutputHelper _output;

    public PerformanceTests(PostgreSqlFixture fixture, ITestOutputHelper output) 
        : base(fixture)
    {
        _output = output;
    }

    [Fact]
    public async Task Database_ShouldHandle_BulkInserts_Efficiently()
    {
        // Arrange
        const int entityCount = 100; 
        var entities = Enumerable.Range(1, entityCount)
            .Select(i => new Asset 
            { 
                Nome = $"Bulk Asset {i}",
                Codigo = $"BULK{i:D4}",
                Tipo = "Teste",
                PrecoAtual = 10.00m,
                Risco = 5.00m,
                Rentabilidade = 8.00m,
                DataCriacao = DateTime.UtcNow,
                Ativo_Status = true
            })
            .ToList();

        var stopwatch = Stopwatch.StartNew();

        // Act
        await ExecuteInScopeAsync(async serviceProvider =>
        {
            var context = serviceProvider.GetRequiredService<InvestmentDbContext>();
            context.Assets.AddRange(entities);
            await context.SaveChangesAsync();
        });

        stopwatch.Stop();

        // Assert
        var insertedCount = await ExecuteInScopeAsync(async serviceProvider =>
        {
            var context = serviceProvider.GetRequiredService<InvestmentDbContext>();
            return await context.Assets.CountAsync(a => a.Codigo.StartsWith("BULK"));
        });

        Assert.Equal(entityCount, insertedCount);
        Assert.True(stopwatch.ElapsedMilliseconds < 10000, 
            $"Bulk insert took too long: {stopwatch.ElapsedMilliseconds}ms");

        _output.WriteLine($"Bulk insert de {entityCount} entidades executado em {stopwatch.ElapsedMilliseconds}ms");
    }

    [Fact]
    public async Task Database_ShouldHandle_ConcurrentOperations()
    {
        // Arrange
        const int taskCount = 5; 
        const int entitiesPerTask = 20; 

        var stopwatch = Stopwatch.StartNew();

        // Act
        var tasks = Enumerable.Range(1, taskCount)
            .Select(async taskId =>
            {
                await ExecuteInScopeAsync(async serviceProvider =>
                {
                    var context = serviceProvider.GetRequiredService<InvestmentDbContext>();
                    
                    var entities = Enumerable.Range(1, entitiesPerTask)
                        .Select(i => new Asset 
                        { 
                            Nome = $"Concurrent Task {taskId} - Asset {i}",
                            Codigo = $"CONC{taskId:D2}{i:D3}",
                            Tipo = "Concurrent Test",
                            PrecoAtual = 15.00m,
                            Risco = 6.00m,
                            Rentabilidade = 10.00m,
                            DataCriacao = DateTime.UtcNow,
                            Ativo_Status = true
                        })
                        .ToList();

                    context.Assets.AddRange(entities);
                    await context.SaveChangesAsync();
                });
            })
            .ToArray();

        await Task.WhenAll(tasks);
        stopwatch.Stop();

        // Assert
        var totalCount = await ExecuteInScopeAsync(async serviceProvider =>
        {
            var context = serviceProvider.GetRequiredService<InvestmentDbContext>();
            return await context.Assets.CountAsync(a => a.Codigo.StartsWith("CONC"));
        });

        var expectedCount = taskCount * entitiesPerTask;
        Assert.Equal(expectedCount, totalCount);

        _output.WriteLine($"Operações concorrentes ({taskCount} tasks x {entitiesPerTask} entidades) " +
                         $"executadas em {stopwatch.ElapsedMilliseconds}ms");
    }

    [Fact]
    public async Task Database_ShouldHandle_ComplexQueries_Efficiently()
    {
        await ExecuteInScopeAsync(async serviceProvider =>
        {
            var context = serviceProvider.GetRequiredService<InvestmentDbContext>();
            await context.SeedTestDataAsync();
        });

        var stopwatch = Stopwatch.StartNew();

        // Act
        var result = await ExecuteInScopeAsync(async serviceProvider =>
        {
            var context = serviceProvider.GetRequiredService<InvestmentDbContext>();
            
            return await context.Clients
                .Include(c => c.Assessor)
                .Include(c => c.Investimentos)
                    .ThenInclude(i => i.Ativo)
                .Include(c => c.Recomendacoes)
                    .ThenInclude(r => r.Ativo)
                .ToListAsync();
        });

        stopwatch.Stop();

        // Assert
        Assert.NotEmpty(result);
        Assert.True(stopwatch.ElapsedMilliseconds < 5000, 
            $"Complex query took too long: {stopwatch.ElapsedMilliseconds}ms");

        _output.WriteLine($"Complex query with includes executada em {stopwatch.ElapsedMilliseconds}ms");
    }
}