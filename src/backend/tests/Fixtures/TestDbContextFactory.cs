using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using INERI.Backend.Models;

namespace INERI.Backend.Data;

public class TestDbContextFactory : IDesignTimeDbContextFactory<InvestmentDbContext>
{
    public InvestmentDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<InvestmentDbContext>();

        var ConnectionString = configuration.GetConnectionString("DefaultConnection")
                                ?? "Host=crossover.proxy.rlwy.net;Port=35925;Database=railway;Username=postgres;Password=uAPPwFoTdfYpzdhUCYeHTyzibqMxltmf";
        optionsBuilder.UseNpgsql(ConnectionString, options =>
        {
            options.MigrationsAssembly(typeof(InvestmentDbContext).Assembly.FullName);
        });

        return new InvestmentDbContext(optionsBuilder.Options);
    }
}

public static class DbContextExtensions
{
    public static async Task<InvestmentDbContext> CreateTestContextAsync(string connectionString)
    {
        var options = new DbContextOptionsBuilder<InvestmentDbContext>()
            .UseNpgsql(connectionString)
            .EnableSensitiveDataLogging()
            .LogTo(Console.WriteLine, LogLevel.Information)
            .Options;

        var context = new InvestmentDbContext(options);

        await context.Database.EnsureCreatedAsync();
        await context.Database.MigrateAsync();

        return context;
    }

    public static async Task SeedTestDataAsync(this InvestmentDbContext context)
    {
        if (!context.Advisors.Any())
        {
            var testAdvisors = new[]
            {
                new Advisor
                {
                    Nome = "João Silva",
                    Email = "joao@teste.com",
                    CategoriaAssessor = CategoriaAssessor.Gold,
                    DataCriacao = DateTime.UtcNow,
                    Ativo = true,
                    PreferenciaVolumeInvestido = 60,
                    PreferenciaNivelDesenquadramento = 60,
                    PreferenciaTempoSemContato = 60
                }
            };

            context.Advisors.AddRange(testAdvisors);
            await context.SaveChangesAsync();
        }
        var advisor = await context.Advisors.FirstAsync();

        if (!context.Clients.Any())
        {
            var testClients = new[]
            {
                new Client
                {
                    Nome = "João Silva",
                    Email = "joao.silva@email.com",
                    Cpf = "12345678901",
                    DataNascimento = DateTime.UtcNow,
                    AssessorId = advisor.Id,
                    DataCriacao = DateTime.UtcNow,
                    Ativo = true
                }
            };

            context.Clients.AddRange(testClients);
            await context.SaveChangesAsync();
        }

        if (!context.Assets.Any())
        {
            var testAssets = new[]
            {
                new Asset
                {
                    Nome = "Tesouro Selic 2029",
                    Codigo = "TSELIC29",
                    Tipo = "Renda Fixa",
                    PrecoAtual = 27.00M,
                    Risco = 1.00M,
                    Rentabilidade = 5.00M,
                    DataCriacao = DateTime.UtcNow,
                    Ativo_Status = true
                },
            };

            context.Assets.AddRange(testAssets);
            await context.SaveChangesAsync();
        }

        var client = await context.Clients.FirstAsync();
        var assets = await context.Assets.ToListAsync();

        if (!context.Investments.Any())
        {
            var testInvestments = new[]
            {
                new Investment
                {
                    ClienteId = client.Id,
                    AtivoId = assets[0].Id, // Tesouro Selic
                    Quantidade = 100,
                    PrecoCompra = 27.00M,
                    DataCompra = DateTime.UtcNow.AddDays(-30),
                    DataCriacao = DateTime.UtcNow
                }
            };

            context.Investments.AddRange(testInvestments);
            await context.SaveChangesAsync();
        }

        if (!context.Recommendations.Any())
        {
            var testRecommendations = new[]
            {
                new Recommendation
                {
                    ClienteId = client.Id,
                    AtivoId = assets[0].Id, // VALE3
                    Descricao = "Subir renda fixa",
                    QuantidadeSugerida = 269.88M,
                    StatusRecomendacao = StatusRecomendacao.Pendente,
                    DataCriacao = DateTime.UtcNow,
                    DataAtualizacao = DateTime.UtcNow
                }
            };

            context.Recommendations.AddRange(testRecommendations);
            await context.SaveChangesAsync();
        }
    }
}