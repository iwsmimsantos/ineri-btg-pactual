using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace INERI.Backend.Data;

[Collection("DatabaseCollection")]
public abstract class IntegrationTestBase : IAsyncLifetime
{
    protected readonly PostgreSqlFixture Fixture;
    protected IServiceProvider Services => Fixture.Services;

    protected IntegrationTestBase(PostgreSqlFixture fixture)
    {
        Fixture = fixture;
    }

    public virtual async Task InitializeAsync()
    {
        await Fixture.CleanDatabaseAsync();
    }

    public virtual Task DisposeAsync()
    {
        return Task.CompletedTask;
    }

    protected async Task<T> ExecuteInScopeAsync<T>(Func<IServiceProvider, Task<T>> operation)
    {
        return await Fixture.ExecuteInScopeAsync(operation);
    }

    protected async Task ExecuteInScopeAsync(Func<IServiceProvider, Task> operation)
    {
        await Fixture.ExecuteInScopeAsync(operation);
    }

    protected async Task<InvestmentDbContext> GetDbContextAsync()
    {
        return await ExecuteInScopeAsync(serviceProvider =>
        {
            var context = serviceProvider.GetRequiredService<InvestmentDbContext>();
            return Task.FromResult(context);
        });
    }
}

[CollectionDefinition("DatabaseCollection")]
public class DatabaseCollection : ICollectionFixture<PostgreSqlFixture>
{

}