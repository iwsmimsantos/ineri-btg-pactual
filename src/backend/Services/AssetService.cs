using INERI.Backend.Models;
using INERI.Backend.Repositories;
using INERI.Backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace INERI.Backend.Services
{
    public class AssetService : IAssetService
    {
        private readonly IAssetRepository _repository;

        /// Construtor do AssetService.
        public AssetService(IAssetRepository repository)
        {
            _repository = repository;
        }

        /// Retorna todas as CATEGORIAS DE ATIVOS disponíveis.
        public async Task<List<string>> GetAssetCategoriesAsync()
        {
            return await _repository.GetAssetCategoriesAsync();
        }

        /// Retorna TODOS OS ATIVOS existentes.
        public async Task<List<Asset>> GetAssetsListAsync()
        {
            return await _repository.GetAssetsListAsync();
        }

        /// Retorna os ATIVOS ASSOCIADOS a um CLIENTE ESPECÍFICO.
        public async Task<List<Asset>> GetAssetsByClientAsync(int clientId)
        {
            return await _repository.GetAssetsByClientAsync(clientId);
        }
    }
}
