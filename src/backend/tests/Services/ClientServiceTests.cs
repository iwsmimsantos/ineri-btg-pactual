using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using Xunit;
using INERI.Backend.DTOs;
using INERI.Backend.Models;
using INERI.Backend.Repositories;
using INERI.Backend.Services;
using INERI.Backend.Services.Interfaces;

namespace INERI.Backend.Tests
{
    public class ClientServiceTests
    {
        private readonly Mock<IClientRepository> _clientRepoMock;
        private readonly Mock<IAdvisorRepository> _advisorRepoMock;
        private readonly Mock<IRiskProfileService> _riskProfileServiceMock;
        private readonly ClientService _service;

        public ClientServiceTests()
        {
            _clientRepoMock = new Mock<IClientRepository>();
            _riskProfileServiceMock = new Mock<IRiskProfileService>();
            _advisorRepoMock = new Mock<IAdvisorRepository>();
            _service = new ClientService(
                _clientRepoMock.Object,
                _riskProfileServiceMock.Object,
                _advisorRepoMock.Object
            );
        }

        [Fact]
        public async Task GetClientDetailsAsync_ClienteExiste_DeveMapearCorretamente()
        {
            // Arrange
            var clientId = 1;
            var investimentos = new List<Investment>
            {
                new Investment { Id = 10, ClienteId = 1, AtivoId = 99, Quantidade = 2m, PrecoCompra = 100m, DataCompra = DateTime.UtcNow },
                new Investment { Id = 11, ClienteId = 1, AtivoId = 100, Quantidade = 1.5m, PrecoCompra = 200m, DataCompra = DateTime.UtcNow }
            };
            var fakeClient = new Client
            {
                Id = clientId,
                Nome = "Maria",
                Email = "maria@teste.com",
                Cpf = "99988877766",
                DataNascimento = new DateTime(1990,5,5),
                AssessorId = 2,
                DataCriacao = DateTime.Parse("2025-01-01T12:00:00Z"),
                Investimentos = investimentos
            };
            _clientRepoMock
                .Setup(r => r.GetWithInvestmentsAsync(It.IsAny<long>()))
                .ReturnsAsync(fakeClient);

            // Act
            var result = await _service.GetClientDetailsAsync(clientId);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(clientId);
            result.NomeCompleto.Should().Be("Maria");
            result.Email.Should().Be("maria@teste.com");
            result.Cpf.Should().Be("99988877766");
            // saldoCarteira = 2*100 + 1.5*200 = 200 + 300 = 500
            result.SaldoCarteira.Should().Be(500m);
            result.UltimoContato.Should().Be(DateTime.Parse("2025-01-01T12:00:00Z"));
            result.Investments.Should().HaveCount(2);
            result.Investments.First(i => i.Id == 10).Quantidade.Should().Be(2m);
        }

        [Fact]
        public async Task GetClientDetailsAsync_ClienteNaoExiste_DeveRetornarNull()
        {
            // Arrange
            _clientRepoMock
                .Setup(r => r.GetWithInvestmentsAsync(It.IsAny<long>()))
                .ReturnsAsync((Client?)null);

            // Act
            var result = await _service.GetClientDetailsAsync(999);

            // Assert
            result.Should().BeNull();
        }
    }
}
