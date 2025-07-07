using INERI.Backend.Models;
using INERI.Backend.Repositories;
using INERI.Backend.Services;
using FluentAssertions;
using Moq;
using Xunit;

namespace INERI.Backend.Tests.Services;

public class AssetServiceTests
{
    private readonly Mock<IAssetRepository> _mockAssetRepository;
    private readonly AssetService _assetService;

    public AssetServiceTests()
    {
        _mockAssetRepository = new Mock<IAssetRepository>();
        _assetService = new AssetService(_mockAssetRepository.Object);
    }

    #region GetAssetsByClient Tests

    [Fact]
    public async Task GetAssetsByClient_GivenValidClientId_WhenClientHasAssets_ThenReturnsClientAssets()
    {
        // Arrange - Given valid client ID and client has assets
        var clientId = 1;
        var expectedAssets = new List<Asset>
        {
            new Asset { Id = 1, Codigo = "PETR4", Nome = "Petrobras", Tipo = "Acao", PrecoAtual = 32.50m, Risco = 8.5m, Rentabilidade = 12.3m },
            new Asset { Id = 2, Codigo = "VALE3", Nome = "Vale", Tipo = "Acao", PrecoAtual = 65.80m, Risco = 7.2m, Rentabilidade = 15.7m }
        };

        _mockAssetRepository
            .Setup(x => x.GetAssetsByClientAsync(clientId))
            .ReturnsAsync(expectedAssets);

        // Act - When calling GetAssetsByClient
        var result = await _assetService.GetAssetsByClientAsync(clientId);

        // Assert - Then returns client's assets
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        result.Should().BeEquivalentTo(expectedAssets);
        _mockAssetRepository.Verify(x => x.GetAssetsByClientAsync(clientId), Times.Once);
    }

    [Fact]
    public async Task GetAssetsByClient_GivenValidClientId_WhenClientHasNoAssets_ThenReturnsEmptyList()
    {
        // Arrange - Given valid client ID but client has no assets
        var clientId = 2;
        var expectedAssets = new List<Asset>();

        _mockAssetRepository
            .Setup(x => x.GetAssetsByClientAsync(clientId))
            .ReturnsAsync(expectedAssets);

        // Act - When calling GetAssetsByClient
        var result = await _assetService.GetAssetsByClientAsync(clientId);

        // Assert - Then returns empty list
        result.Should().NotBeNull();
        result.Should().BeEmpty();
        _mockAssetRepository.Verify(x => x.GetAssetsByClientAsync(clientId), Times.Once);
    }

    [Fact]
    public async Task GetAssetsByClient_GivenNonExistentClientId_WhenClientDoesNotExist_ThenReturnsEmptyList()
    {
        // Arrange - Given non-existent client ID
        var nonExistentClientId = 999;
        var expectedAssets = new List<Asset>();

        _mockAssetRepository
            .Setup(x => x.GetAssetsByClientAsync(nonExistentClientId))
            .ReturnsAsync(expectedAssets);

        // Act - When calling GetAssetsByClient
        var result = await _assetService.GetAssetsByClientAsync(nonExistentClientId);

        // Assert - Then returns empty list
        result.Should().NotBeNull();
        result.Should().BeEmpty();
        _mockAssetRepository.Verify(x => x.GetAssetsByClientAsync(nonExistentClientId), Times.Once);
    }

    [Fact]
    public async Task GetAssetsByClient_GivenZeroClientId_WhenInvalidClientId_ThenReturnsEmptyList()
    {
        // Arrange - Given invalid client ID (zero)
        var invalidClientId = 0;
        var expectedAssets = new List<Asset>();

        _mockAssetRepository
            .Setup(x => x.GetAssetsByClientAsync(invalidClientId))
            .ReturnsAsync(expectedAssets);

        // Act - When calling GetAssetsByClient
        var result = await _assetService.GetAssetsByClientAsync(invalidClientId);

        // Assert - Then returns empty list
        result.Should().NotBeNull();
        result.Should().BeEmpty();
        _mockAssetRepository.Verify(x => x.GetAssetsByClientAsync(invalidClientId), Times.Once);
    }

    [Fact]
    public async Task GetAssetsByClient_GivenNegativeClientId_WhenInvalidClientId_ThenReturnsEmptyList()
    {
        // Arrange - Given invalid client ID (negative)
        var invalidClientId = -1;
        var expectedAssets = new List<Asset>();

        _mockAssetRepository
            .Setup(x => x.GetAssetsByClientAsync(invalidClientId))
            .ReturnsAsync(expectedAssets);

        // Act - When calling GetAssetsByClient
        var result = await _assetService.GetAssetsByClientAsync(invalidClientId);

        // Assert - Then returns empty list
        result.Should().NotBeNull();
        result.Should().BeEmpty();
        _mockAssetRepository.Verify(x => x.GetAssetsByClientAsync(invalidClientId), Times.Once);
    }

    [Fact]
    public async Task GetAssetsByClient_GivenRepositoryThrowsException_WhenDatabaseError_ThenPropagatesException()
    {
        // Arrange - Given repository throws exception
        var clientId = 1;
        var expectedException = new Exception("Database connection failed");

        _mockAssetRepository
            .Setup(x => x.GetAssetsByClientAsync(clientId))
            .ThrowsAsync(expectedException);

        // Act & Assert - When calling GetAssetsByClient, then exception is propagated
        await _assetService.Invoking(x => x.GetAssetsByClientAsync(clientId))
            .Should().ThrowAsync<Exception>()
            .WithMessage("Database connection failed");

        _mockAssetRepository.Verify(x => x.GetAssetsByClientAsync(clientId), Times.Once);
    }

    [Fact]
    public async Task GetAssetsByClient_GivenClientWithMixedAssetTypes_WhenClientHasVariousAssets_ThenReturnsAllAssetTypes()
    {
        // Arrange - Given client ID with various asset types
        var clientId = 3;
        var expectedAssets = new List<Asset>
        {
            new Asset { Id = 1, Codigo = "PETR4", Nome = "Petrobras", Tipo = "Acao", PrecoAtual = 32.50m, Risco = 8.5m, Rentabilidade = 12.3m },
            new Asset { Id = 2, Codigo = "LTN", Nome = "Letra do Tesouro Nacional", Tipo = "RendaFixa", PrecoAtual = 1000.00m, Risco = 2.1m, Rentabilidade = 10.5m },
            new Asset { Id = 3, Codigo = "HASH11", Nome = "Hashdex Nasdaq Crypto Index", Tipo = "ETF", PrecoAtual = 45.67m, Risco = 15.8m, Rentabilidade = 25.4m }
        };

        _mockAssetRepository
            .Setup(x => x.GetAssetsByClientAsync(clientId))
            .ReturnsAsync(expectedAssets);

        // Act - When calling GetAssetsByClient
        var result = await _assetService.GetAssetsByClientAsync(clientId);

        // Assert - Then returns all asset types
        result.Should().NotBeNull();
        result.Should().HaveCount(3);
        result.Should().Contain(a => a.Tipo == "Acao");
        result.Should().Contain(a => a.Tipo == "RendaFixa");
        result.Should().Contain(a => a.Tipo == "ETF");
        result.Should().BeEquivalentTo(expectedAssets);
        _mockAssetRepository.Verify(x => x.GetAssetsByClientAsync(clientId), Times.Once);
    }

    [Fact]
    public async Task GetAssetsByClient_GivenClientWithInactiveAssets_WhenRepositoryReturnsInactiveAssets_ThenReturnsOnlyActiveAssets()
    {
        // Arrange - Given client ID with mix of active and inactive assets
        var clientId = 4;
        var expectedAssets = new List<Asset>
        {
            new Asset { Id = 1, Codigo = "PETR4", Nome = "Petrobras", Tipo = "Acao", PrecoAtual = 32.50m, Risco = 8.5m, Rentabilidade = 12.3m, Ativo_Status = true },
            new Asset { Id = 2, Codigo = "VALE3", Nome = "Vale", Tipo = "Acao", PrecoAtual = 65.80m, Risco = 7.2m, Rentabilidade = 15.7m, Ativo_Status = true }
        };

        _mockAssetRepository
            .Setup(x => x.GetAssetsByClientAsync(clientId))
            .ReturnsAsync(expectedAssets);

        // Act - When calling GetAssetsByClient
        var result = await _assetService.GetAssetsByClientAsync(clientId);

        // Assert - Then returns only active assets
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
        result.Should().OnlyContain(a => a.Ativo_Status == true);
        _mockAssetRepository.Verify(x => x.GetAssetsByClientAsync(clientId), Times.Once);
    }

    #endregion

    #region Additional Helper Tests for Context

    [Fact]
    public async Task GetAssetsList_GivenRepositoryCall_WhenCalled_ThenReturnsAllAssets()
    {
        // Arrange - Given repository returns assets
        var expectedAssets = new List<Asset>
        {
            new Asset { Id = 1, Codigo = "PETR4", Nome = "Petrobras", Tipo = "Acao" },
            new Asset { Id = 2, Codigo = "VALE3", Nome = "Vale", Tipo = "Acao" }
        };

        _mockAssetRepository
            .Setup(x => x.GetAssetsListAsync())
            .ReturnsAsync(expectedAssets);

        // Act - When calling GetAssetsList
        var result = await _assetService.GetAssetsListAsync();

        // Assert - Then returns all assets
        result.Should().BeEquivalentTo(expectedAssets);
        _mockAssetRepository.Verify(x => x.GetAssetsListAsync(), Times.Once);
    }

    #endregion
}
