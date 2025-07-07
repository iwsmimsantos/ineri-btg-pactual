
using INERI.Backend.Models;
using INERI.Backend.Repositories;
using INERI.Backend.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace INERI.Backend.Data;

public class InvestorProfileTests
{
    private readonly Mock<IClientRepository> _mockClientRepository;
    private readonly Mock<ILogger<RiskProfileService>> _mockLogger;
    private readonly RiskProfileService _service;

    public InvestorProfileTests()
    {
        _mockClientRepository = new Mock<IClientRepository>();
        _mockLogger = new Mock<ILogger<RiskProfileService>>();
        _service = new RiskProfileService(_mockClientRepository.Object, _mockLogger.Object);
    }

    private Client CreateTestClient(int id, string nome, string email, string cpf, int ageYears)
    {
        return new Client
        {
            Id = id,
            Nome = nome,
            Email = email,
            Cpf = cpf,
            DataNascimento = DateTime.Now.AddYears(-ageYears),
            AssessorId = 1,
            DataCriacao = DateTime.UtcNow,
            Ativo = true,
            Assessor = new Advisor { Id = 1, Nome = "Assessor Teste", Email = "assessor@email.com" },
            HistoricosRiscoDeclarado = new List<DeclaredRiskHistory>(),
            HistoricosRiscoCalculado = new List<CalculatedRiskHistory>(),
            Investimentos = new List<Investment>(),
            Recomendacoes = new List<Recommendation>()
        };
    }

    [Fact]
    public async Task CreateAndRetrieveProfile_WorksCorrectly()
    {
        var clientId = 1;
        var expectedProfile = "Moderado";
        var client = CreateTestClient(clientId, "João Silva", "joao.silva@email.com", "12345678901", 35);

        client.HistoricosRiscoDeclarado.Add(new DeclaredRiskHistory
        {
            Id = 1,
            ClienteId = clientId,
            RiscoDeclarado = 5,
            DataDeclaracao = DateTime.Now.AddDays(-1)
        });

        _mockClientRepository
            .Setup(x => x.GetWithRiskHistoryAsync(clientId))
            .ReturnsAsync(client);

        var result = await _service.GetInvestorProfileAsync(clientId);

        Assert.NotNull(result);
        Assert.Equal(expectedProfile, result);
        _mockClientRepository.Verify(x => x.GetWithRiskHistoryAsync(clientId), Times.Once);
    }

    [Fact]
    public async Task UpdateProfile_WithValidData_UpdatesCorrectly()
    {
        var clientId = 4;
        var initialProfile = "Conservador";
        var updatedProfile = "Moderado";
        var client = CreateTestClient(clientId, "Carlos Lima", "carlos.lima@email.com", "12345678903", 45);

        client.HistoricosRiscoDeclarado.Add(new DeclaredRiskHistory
        {
            Id = 1,
            ClienteId = clientId,
            RiscoDeclarado = 2,
            DataDeclaracao = DateTime.Now.AddDays(-10)
        });

        client.HistoricosRiscoDeclarado.Add(new DeclaredRiskHistory
        {
            Id = 2,
            ClienteId = clientId,
            RiscoDeclarado = 5,
            DataDeclaracao = DateTime.Now.AddDays(-1)
        });

        _mockClientRepository
            .Setup(x => x.GetWithRiskHistoryAsync(clientId))
            .ReturnsAsync(client);

        var result = await _service.GetInvestorProfileAsync(clientId);

        Assert.NotEqual(initialProfile, result);
        Assert.Equal(updatedProfile, result);
        _mockClientRepository.Verify(x => x.GetWithRiskHistoryAsync(clientId), Times.Once);
    }

    [Fact]
    public async Task CreateProfile_WithDuplicateEmail_ThrowsException()
    {
        var existingClient = CreateTestClient(1, "Cliente Existente", "cliente@teste.com", "12345678901", 30);
        var duplicateClient = CreateTestClient(2, "Cliente Duplicado", "cliente@teste.com", "98765432109", 25);

        _mockClientRepository
            .Setup(x => x.GetByEmailAsync("cliente@teste.com"))
            .ReturnsAsync(existingClient);

        _mockClientRepository
            .Setup(x => x.AddAsync(It.IsAny<Client>()))
            .ThrowsAsync(new DbUpdateException("Email já cadastrado."));

        var exception = await Assert.ThrowsAsync<DbUpdateException>(
            async () => await _service.CreateProfile(duplicateClient)
        );

        Assert.Contains("email", exception.Message.ToLower());
        _mockClientRepository.Verify(x => x.AddAsync(It.IsAny<Client>()), Times.Once);
    }

    [Fact]
    public async Task UpdateProfile_WithInvalidName_ThrowsException()
    {
        var client = CreateTestClient(1, "", "valido@email.com", "12345678901", 30);

        var exception = await Assert.ThrowsAsync<ValidationException>(
            async () => await _service.UpdateProfile(client)
        );

        Assert.Contains("Nome", exception.Message);
        _mockClientRepository.Verify(x => x.UpdateAsync(It.IsAny<Client>()), Times.Never);
    }

    [Fact]
    public async Task UpdateProfile_WithInvalidEmail_ThrowsException()
    {
        var client = CreateTestClient(1, "Nome Válido", "", "12345678901", 30);

        var exception = await Assert.ThrowsAsync<ValidationException>(
            async () => await _service.UpdateProfile(client)
        );

        Assert.Contains("Email", exception.Message);
        _mockClientRepository.Verify(x => x.UpdateAsync(It.IsAny<Client>()), Times.Never);
    }

    [Fact]
    public async Task UpdateProfile_WithInvalidCpf_ThrowsException()
    {
        var client = CreateTestClient(1, "Nome Válido", "valido@email.com", "", 30);

        var exception = await Assert.ThrowsAsync<ValidationException>(
            async () => await _service.UpdateProfile(client)
        );

        Assert.Contains("CPF", exception.Message);
        _mockClientRepository.Verify(x => x.UpdateAsync(It.IsAny<Client>()), Times.Never);
    } 
}

