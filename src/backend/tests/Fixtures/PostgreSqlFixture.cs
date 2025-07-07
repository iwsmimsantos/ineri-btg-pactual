using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Testcontainers.PostgreSql;
using Xunit;
using DotNet.Testcontainers.Builders;
using INERI.Backend.Data;

namespace INERI.Backend.Data;

public class PostgreSqlFixture : IAsyncLifetime
{
    private readonly PostgreSqlContainer _container;
    private readonly IServiceCollection _services;
    private ServiceProvider? _serviceProvider;

    public string ConnectionString { get; private set; } = string.Empty;
    public IServiceProvider Services => _serviceProvider ?? throw new InvalidOperationException("Fixture não inicializada");

    public PostgreSqlFixture()
    {
        _container = new PostgreSqlBuilder()
            .WithImage("postgres:15-alpine")
            .WithDatabase("railway")
            .WithUsername("postgres")
            .WithPassword("uAPPwFoTdfYpzdhUCYeHTyzibqMxltmf")
            .WithPortBinding(0, true)
            .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(5432))
            .WithCleanUp(true)
            .Build();

        _services = new ServiceCollection();
    }

    public async Task InitializeAsync()
    {
        try
        {
            await _container.StartAsync();

            ConnectionString = _container.GetConnectionString();

            ConfigureServices();

            _services.AddDbContext<InvestmentDbContext>(options =>
                options.UseNpgsql(ConnectionString)
                    .EnableSensitiveDataLogging()
                    .LogTo(Console.WriteLine, LogLevel.Information));

            _serviceProvider = _services.BuildServiceProvider();

            await ApplyMigrationsAsync();

            Console.WriteLine($"PostgreSQL container iniciado: {ConnectionString}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao inicializar PostgreSQL fixture: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
            throw;
        }
    }

    public async Task DisposeAsync()
    {
        try
        {
            _serviceProvider?.Dispose();
            await _container.DisposeAsync();
            Console.WriteLine("PostgreSQL container finalizado com sucesso");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao finalizar PostgreSQL fixture: {ex.Message}");
        }
    }

    private void ConfigureServices()
    {
        _services.AddLogging(builder => builder.AddConsole().SetMinimumLevel(LogLevel.Information));

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = ConnectionString
            })
            .Build();

        _services.AddSingleton<IConfiguration>(configuration);
    }

    private async Task ApplyMigrationsAsync()
    {
        using var scope = _serviceProvider!.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<InvestmentDbContext>();

        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();

        Console.WriteLine("Migrações aplicadas com sucesso");
    }

    public async Task<T> ExecuteInScopeAsync<T>(Func<IServiceProvider, Task<T>> operation)
    {
        using var scope = _serviceProvider!.CreateScope();
        return await operation(scope.ServiceProvider);
    }

    public async Task ExecuteInScopeAsync(Func<IServiceProvider, Task> operation)
    {
        using var scope = _serviceProvider!.CreateScope();
        await operation(scope.ServiceProvider);
    }

    public async Task CleanDatabaseAsync()
    {
        await ExecuteInScopeAsync(async serviceProvider =>
        {
            var context = serviceProvider.GetRequiredService<InvestmentDbContext>();

            var entityTypes = context.Model.GetEntityTypes();
            var tableNames = entityTypes
                .Select(t => t.GetTableName())
                .Where(name => !string.IsNullOrEmpty(name) && name != "__EFMigrationsHistory")
                .Distinct()
                .ToList();

            foreach (var tableName in tableNames)
            {
                try
                {
                    await context.Database.ExecuteSqlRawAsync($"TRUNCATE TABLE \"{tableName}\" RESTART IDENTITY CASCADE");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Erro ao limpar tabela {tableName}: {ex.Message}");
                }
            }
        });
    }
}