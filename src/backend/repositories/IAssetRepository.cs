using INERI.Backend.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace INERI.Backend.Repositories
{
    public interface IAssetRepository
    {
        Task<List<Asset>> GetAssetsListAsync();
        Task<List<Asset>> GetAssetsByClientAsync(int clientId);
        Task<List<string>> GetAssetCategoriesAsync();
    }
}
