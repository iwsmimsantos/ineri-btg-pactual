using INERI.Backend.Models;

namespace INERI.Backend.Services
{
    public interface IAssetService
    {
        Task<List<Asset>> GetAssetsListAsync();

        Task<List<string>> GetAssetCategoriesAsync();

        Task<List<Asset>> GetAssetsByClientAsync(int clientId);
    }
}
