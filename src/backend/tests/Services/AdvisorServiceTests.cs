using INERI.Backend.Models;
using INERI.Backend.Repositories;
using INERI.Backend.Services;
using FluentAssertions;
using Moq;
using Xunit;

namespace INERI.Backend.Tests.Services;

public class AdvisorServiceTests
{
    private readonly Mock<IAdvisorRepository> _mockAdvisorRepository;
    private readonly Mock<IAdvisorRepository> _mockAdvisorRepositoryMock;
    private readonly AdvisorService _advisorService;

    public AdvisorServiceTests()
    {
        _mockAdvisorRepository = new Mock<IAdvisorRepository>();
        _advisorService = new AdvisorService(_mockAdvisorRepository.Object);
    }

    [Fact]
    public async Task GetAdvisorById_ValidId_ReturnsAdvisor()
    {
        var advisorId = 1;
        var expectedAdvisor = new Advisor
        {
            Id = 1,
            Nome = "João Silva",
            Email = "joao.silva@exemplo.com",
            CategoriaAssessor = CategoriaAssessor.Gold,
            DataCriacao = DateTime.Parse("2024-01-01"),
            Ativo = true,
            PreferenciaVolumeInvestido = 60,
            PreferenciaNivelDesenquadramento = 60,
            PreferenciaTempoSemContato = 60
        };

        _mockAdvisorRepository
            .Setup(x => x.GetAdvisorByIdAsync(advisorId))
            .ReturnsAsync(expectedAdvisor);

        var result = await _advisorService.GetAdvisorByIdAsync(advisorId);

        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(expectedAdvisor);
        _mockAdvisorRepository.Verify(repo => repo.GetAdvisorByIdAsync(advisorId), Times.Once);
    }

    [Fact]
    public async Task GetAdivisorWithClients_ValidId_ReturnsAdvisorWithClients()
    {
        var advisorId = 1;
        var expectedAdvisor = new Advisor
        {
            Id = 1,
            Nome = "João Silva",
            Email = "joao.silva@exemplo.com",
            CategoriaAssessor = CategoriaAssessor.Gold,
            DataCriacao = DateTime.Parse("2024-01-01"),
            Ativo = true,
            PreferenciaVolumeInvestido = 60,
            PreferenciaNivelDesenquadramento = 60,
            PreferenciaTempoSemContato = 60,
            Clientes = new List<Client>
            {
                new Client
                {
                    Id = 1,
                    Nome = "Cliente 1",
                    Email = "cliente1@exemplo.com",
                    AssessorId = 1,
                    DataCriacao = DateTime.Parse("2024-01-15"),
                    Ativo = true
                },
                new Client
                {
                    Id = 2,
                    Nome = "Cliente 2",
                    Email = "cliente2@exemplo.com",
                    AssessorId = 1,
                    DataCriacao = DateTime.Parse("2024-01-20"),
                    Ativo = true
                }

            }
        };

        _mockAdvisorRepository
            .Setup(x => x.GetWithClientsAsync(advisorId))
            .ReturnsAsync(expectedAdvisor);

        var result = await _advisorService.GetAdvisorWithClientsAsync(advisorId);

        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(expectedAdvisor);
        result!.Clientes.Should().HaveCount(2);
        result.Clientes.Should().OnlyContain(c => c.AssessorId == advisorId);

        _mockAdvisorRepository.Verify(repo => repo.GetWithClientsAsync(advisorId), Times.Once);
    }

    [Fact]
    public async Task GetAdvisorWithClientsAsync_ValidIdWithNoClients_ReturnsAdvisorWithEmptyClientsList()
    {
        var advisorId = 2;
        var expectedAdvisor = new Advisor
        {
            Id = 2,
            Nome = "Maria Santos",
            Email = "maria.santos@exemplo.com",
            CategoriaAssessor = CategoriaAssessor.Prata,
            DataCriacao = DateTime.Parse("2024-02-01"),
            Ativo = true,
            PreferenciaVolumeInvestido = 40,
            PreferenciaNivelDesenquadramento = 50,
            PreferenciaTempoSemContato = 30,
            Clientes = new List<Client>()
        };

        _mockAdvisorRepository
            .Setup(x => x.GetWithClientsAsync(advisorId))
            .ReturnsAsync(expectedAdvisor);

        var result = await _advisorService.GetAdvisorWithClientsAsync(advisorId);
        
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(expectedAdvisor);
        result!.Clientes.Should().BeEmpty();

        _mockAdvisorRepository.Verify(repo => repo.GetWithClientsAsync(advisorId), Times.Once);
    }
    
}