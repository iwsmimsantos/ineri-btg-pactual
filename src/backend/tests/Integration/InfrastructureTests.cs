using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using Xunit.Abstractions;

namespace INERI.Backend.Data;

public class InfrastructureTests : IntegrationTestBase
{
    private readonly ITestOutputHelper _output;

    public InfrastructureTests(PostgreSqlFixture fixture, ITestOutputHelper output) 
        : base(fixture)
    {
        _output = output;
    }

    [Fact]
    public async Task Container_ShouldStart_Successfully()
    {
        // Arrange & Act
        var connectionString = Fixture.ConnectionString;
        
        // Assert
        Assert.NotNull(connectionString);
        Assert.NotEmpty(connectionString);
        Assert.Contains("Host=", Fixture.ConnectionString);
        Assert.Contains("Port=", Fixture.ConnectionString);
        Assert.Contains("Database=railway", connectionString);
        
        _output.WriteLine($"Container iniciado com sucesso: {connectionString}");
    }

    [Fact]
    public async Task Database_ShouldConnect_Successfully()
    {
        // Arrange & Act
        var canConnect = await ExecuteInScopeAsync(async serviceProvider =>
        {
            var context = serviceProvider.GetRequiredService<InvestmentDbContext>();
            return await context.Database.CanConnectAsync();
        });

        // Assert
        Assert.True(canConnect, "Não foi possível conectar ao banco de dados");
        
        _output.WriteLine("Conexão com banco de dados estabelecida com sucesso");
    }

    [Fact]
    public async Task Database_ShouldHave_ExpectedTables()
    {
        // Arrange & Act
        var tableNames = await ExecuteInScopeAsync(async serviceProvider =>
        {
            var context = serviceProvider.GetRequiredService<InvestmentDbContext>();

            var tables = await context.Database.SqlQueryRaw<string>(
                @"SELECT table_name 
                  FROM information_schema.tables 
                  WHERE table_schema = 'public' 
                  AND table_type = 'BASE TABLE'")
                .ToListAsync();

            return tables;
        });
    }
}