using Microsoft.EntityFrameworkCore;
using INERI.Backend.Data;
using INERI.Backend.Models;

namespace INERI.Backend.Repositories;

public class AssetRepository : GenericRepository<Asset>, IAssetRepository
{
    public AssetRepository(InvestmentDbContext context) : base(context) { }

    public async Task<List<Asset>> GetAssetsListAsync()
    {
        return await _dbSet
            .Where(a => a.Ativo_Status)
            .ToListAsync();
    }


    public async Task<List<string>> GetAssetCategoriesAsync()
    {
        return await _dbSet
            .Where(a => a.Ativo_Status)
            .Select(a => a.Tipo)
            .Distinct()
            .ToListAsync();
    }

    public async Task<List<Asset>> GetAssetsByClientAsync(int clientId)
    {
        // Handle invalid client IDs gracefully (return empty list)
        if (clientId <= 0)
        {
            return new List<Asset>();
        }

        try
        {
            // Query assets through the Investment relationship
            var clientAssets = await _context.Set<Investment>()
                .Where(i => i.ClienteId == clientId)
                .Include(i => i.Ativo)
                .Where(i => i.Ativo.Ativo_Status) // Only active assets
                .Select(i => i.Ativo)
                .Distinct()
                .ToListAsync();

            return clientAssets;
        }
        catch (Exception)
        {
            // Let exceptions propagate as expected by tests
            // This maintains the contract established in TDD tests
            throw;
        }
    }
}
