using Xunit;
using Moq;
using FluentAssertions;
using System.Collections.Generic;
using System.Threading.Tasks;
using INERI.Backend.Services;
using INERI.Backend.Repositories;
using INERI.Backend.DTOs;
using INERI.Backend.Models;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Threading;
using INERI.Backend.Services.Interfaces;

namespace INERI.Backend.Tests
{
    public class ClientClassificationServiceTests
    {
        private readonly Mock<IClientRepository> _mockClientRepository;
        private readonly Mock<IRiskProfileService> _mockRiskProfileService;
        private readonly Mock<IAdvisorRepository> _mockAdvisorRepository;
        private readonly ClientClassificationService _service;
        private readonly ClientService _realClientService; 

        public ClientClassificationServiceTests()
        {
            _mockClientRepository = new Mock<IClientRepository>();
            _mockRiskProfileService = new Mock<IRiskProfileService>();
            _mockAdvisorRepository = new Mock<IAdvisorRepository>();

            _realClientService = new ClientService(
                _mockClientRepository.Object,
                _mockRiskProfileService.Object,
                _mockAdvisorRepository.Object);

            _service = new ClientClassificationService(
                _mockClientRepository.Object,
                _mockRiskProfileService.Object,
                _realClientService,
                _mockAdvisorRepository.Object);
        }

        [Fact]
        public async Task GetPriorityClientsAsync_ShouldReturnClientsFromClientService()
        {
            // Arrange
            var advisorId = 1;
            var expectedClients = new List<ClientResponseDTO>
            {
                new ClientResponseDTO { Id = 1, Nome = "Client A" },
                new ClientResponseDTO { Id = 2, Nome = "Client B" }
            };

            _mockClientRepository.Setup(r => r.GetByAdvisorIdAsync(advisorId))
                .ReturnsAsync(new List<Client> { 
                    new Client { Id = 1, Nome = "Client A", AssessorId = advisorId, DataCriacao = DateTime.UtcNow.AddMonths(-1) },
                    new Client { Id = 2, Nome = "Client B", AssessorId = advisorId, DataCriacao = DateTime.UtcNow.AddMonths(-2) }
                });
            _mockClientRepository.Setup(r => r.GetWithRiskHistoryAsync(It.IsAny<int>()))
                .ReturnsAsync((int clientId) => new Client { Id = clientId, Nome = "Client " + (char)('A' + clientId - 1), Investimentos = new List<Investment>(), HistoricosRiscoCalculado = new List<CalculatedRiskHistory>(), HistoricosRiscoDeclarado = new List<DeclaredRiskHistory>() });

            _mockRiskProfileService.Setup(s => s.GetMismatchPercentageAsync(It.IsAny<int>()))
                .ReturnsAsync(10M);
            _mockRiskProfileService.Setup(s => s.GetInvestorProfileAsync(It.IsAny<int>()))
                .ReturnsAsync("Perfil");
            _mockRiskProfileService.Setup(s => s.GetPortfolioProfileAsync(It.IsAny<int>()))
                .ReturnsAsync("Perfil");
            _mockRiskProfileService.Setup(s => s.IsClientMismatchedAsync(It.IsAny<int>()))
                .ReturnsAsync(false);

            _mockAdvisorRepository.Setup(r => r.GetByIdAsync(advisorId))
                .ReturnsAsync(new Advisor { Id = advisorId, PreferenciaVolumeInvestido = 33, PreferenciaNivelDesenquadramento = 33, PreferenciaTempoSemContato = 34 });

            // Act
            var result = await _service.GetPriorityClientsAsync(advisorId);

            // Assert
            result.Should().HaveCount(2);
            result.Should().BeEquivalentTo(expectedClients, options => options.Excluding(c => c.Patrimonio).Excluding(c => c.PerfilDeInvestidor).Excluding(c => c.PerfilCarteira).Excluding(c => c.RiscoCarteiraAtual).Excluding(c => c.PercentualDesenquadramento).Excluding(c => c.IsDesenquadrado).Excluding(c => c.RiscoCalculado).Excluding(c => c.RiscoDeclarado).Excluding(c => c.UltimaAtualizacaoRisco).Excluding(c => c.ScorePrioridade));
        }

        [Fact]
        public async Task GetHighInvestmentVolumeClientsAsync_ShouldReturnClientsWithHighInvestment()
        {
            // Arrange
            var advisorId = 1;
            var client1 = new Client { Id = 1, Nome = "Client A", AssessorId = advisorId };
            var client2 = new Client { Id = 2, Nome = "Client B", AssessorId = advisorId };

            var asset1 = new Asset { Id = 1, PrecoAtual = 1000M };
            var asset2 = new Asset { Id = 2, PrecoAtual = 500M };

            client1.Investimentos.Add(new Investment { Quantidade = 1000, Ativo = asset1 }); // 1,000,000
            client2.Investimentos.Add(new Investment { Quantidade = 100, Ativo = asset2 });   // 50,000

            _mockClientRepository.Setup(r => r.GetByAdvisorIdAsync(advisorId))
                .ReturnsAsync(new List<Client> { client1, client2 });
            _mockClientRepository.Setup(r => r.GetByIdAsync(client1.Id)).ReturnsAsync(client1); 
            _mockClientRepository.Setup(r => r.GetByIdAsync(client2.Id)).ReturnsAsync(client2); 
            _mockClientRepository.Setup(r => r.GetWithInvestmentsAsync(client1.Id))
                .ReturnsAsync(client1);
            _mockClientRepository.Setup(r => r.GetWithInvestmentsAsync(client2.Id))
                .ReturnsAsync(client2);

            _mockRiskProfileService.Setup(s => s.GetInvestorProfileAsync(It.IsAny<int>()))
                .ReturnsAsync("Perfil");
            _mockRiskProfileService.Setup(s => s.GetPortfolioProfileAsync(It.IsAny<int>()))
                .ReturnsAsync("Perfil");
            _mockRiskProfileService.Setup(s => s.GetPortfolioRiskAsync(It.IsAny<int>()))
                .ReturnsAsync(5);
            _mockRiskProfileService.Setup(s => s.GetMismatchPercentageAsync(It.IsAny<int>()))
                .ReturnsAsync(0);
            _mockRiskProfileService.Setup(s => s.IsClientMismatchedAsync(It.IsAny<int>()))
                .ReturnsAsync(false);

            // Act
            var result = await _service.GetHighInvestmentVolumeClientsAsync(advisorId);

            // Assert
            result.Should().ContainSingle(c => c.Id == client1.Id);
            result.First().Patrimonio.Should().Be(1000000M);
            result.First().Nome.Should().Be("Client A");
        }

        [Fact]
        public async Task GetCriticalMismatchClientsAsync_ShouldReturnClientsWithCriticalMismatch()
        {
            // Arrange
            var advisorId = 1;
            var client1 = new Client { Id = 1, Nome = "Client A", AssessorId = advisorId };
            var client2 = new Client { Id = 2, Nome = "Client B", AssessorId = advisorId };

            _mockClientRepository.Setup(r => r.GetByAdvisorIdAsync(advisorId))
                .ReturnsAsync(new List<Client> { client1, client2 });
            _mockClientRepository.Setup(r => r.GetByIdAsync(client1.Id)).ReturnsAsync(client1); 
            _mockClientRepository.Setup(r => r.GetByIdAsync(client2.Id)).ReturnsAsync(client2); 
            _mockClientRepository.Setup(r => r.GetWithInvestmentsAsync(client1.Id))
                .ReturnsAsync(new Client { Id = client1.Id, Nome = client1.Nome, Investimentos = new List<Investment>() });
            _mockClientRepository.Setup(r => r.GetWithInvestmentsAsync(client2.Id))
                .ReturnsAsync(new Client { Id = client2.Id, Nome = client2.Nome, Investimentos = new List<Investment>() });

            _mockRiskProfileService.Setup(s => s.GetMismatchPercentageAsync(client1.Id))
                .ReturnsAsync(50M); // Critical mismatch
            _mockRiskProfileService.Setup(s => s.GetMismatchPercentageAsync(client2.Id))
                .ReturnsAsync(10M); // No critical mismatch

            _mockRiskProfileService.Setup(s => s.GetInvestorProfileAsync(It.IsAny<int>()))
                .ReturnsAsync("Perfil");
            _mockRiskProfileService.Setup(s => s.GetPortfolioProfileAsync(It.IsAny<int>()))
                .ReturnsAsync("Perfil");
            _mockRiskProfileService.Setup(s => s.GetPortfolioRiskAsync(It.IsAny<int>()))
                .ReturnsAsync(5);
            _mockRiskProfileService.Setup(s => s.IsClientMismatchedAsync(It.IsAny<int>()))
                .ReturnsAsync(true);

            // Act
            var result = await _service.GetCriticalMismatchClientsAsync(advisorId);

            // Assert
            result.Should().ContainSingle(c => c.Id == client1.Id);
            result.First().PercentualDesenquadramento.Should().Be(50M);
            result.First().Nome.Should().Be("Client A");
        }

        [Fact]
        public async Task GetHighFinancialExposureClientsAsync_ShouldReturnClientsWithHighExposure()
        {
            // Arrange
            var advisorId = 1;
            var client1 = new Client { Id = 1, Nome = "Client A", AssessorId = advisorId };
            var client2 = new Client { Id = 2, Nome = "Client B", AssessorId = advisorId };

            var assetA = new Asset { Id = 1, Tipo = "Ações", PrecoAtual = 100M };
            var assetB = new Asset { Id = 2, Tipo = "Renda Fixa", PrecoAtual = 100M };

            client1.Investimentos.Add(new Investment { Quantidade = 80, Ativo = assetA }); // 80% Ações
            client1.Investimentos.Add(new Investment { Quantidade = 20, Ativo = assetB }); // 20% Renda Fixa

            client2.Investimentos.Add(new Investment { Quantidade = 50, Ativo = assetA }); // 50% Ações
            client2.Investimentos.Add(new Investment { Quantidade = 50, Ativo = assetB }); // 50% Renda Fixa

            _mockClientRepository.Setup(r => r.GetByAdvisorIdAsync(advisorId))
                .ReturnsAsync(new List<Client> { client1, client2 });
            _mockClientRepository.Setup(r => r.GetByIdAsync(client1.Id)).ReturnsAsync(client1); 
            _mockClientRepository.Setup(r => r.GetByIdAsync(client2.Id)).ReturnsAsync(client2); 
            _mockClientRepository.Setup(r => r.GetWithInvestmentsAsync(client1.Id))
                .ReturnsAsync(client1);
            _mockClientRepository.Setup(r => r.GetWithInvestmentsAsync(client2.Id))
                .ReturnsAsync(client2);

            _mockRiskProfileService.Setup(s => s.GetInvestorProfileAsync(It.IsAny<int>()))
                .ReturnsAsync("Perfil");
            _mockRiskProfileService.Setup(s => s.GetPortfolioProfileAsync(It.IsAny<int>()))
                .ReturnsAsync("Perfil");
            _mockRiskProfileService.Setup(s => s.GetPortfolioRiskAsync(It.IsAny<int>()))
                .ReturnsAsync(5);
            _mockRiskProfileService.Setup(s => s.GetMismatchPercentageAsync(It.IsAny<int>()))
                .ReturnsAsync(0);
            _mockRiskProfileService.Setup(s => s.IsClientMismatchedAsync(It.IsAny<int>()))
                .ReturnsAsync(false);

            // Act
            var result = await _service.GetHighFinancialExposureClientsAsync(advisorId);

            // Assert
            result.Should().ContainSingle(c => c.Id == client1.Id);
            result.First().Nome.Should().Be("Client A");
        }

        [Fact]
        public async Task GetClientClassificationSummaryAsync_ShouldReturnCorrectSummary()
        {
            // Arrange
            var advisorId = 1;
            var advisor = new Advisor { Id = advisorId, PreferenciaVolumeInvestido = 33, PreferenciaNivelDesenquadramento = 33, PreferenciaTempoSemContato = 34 };

            var asset1 = new Asset { Id = 1, Tipo = "Ações", PrecoAtual = 1000M, Risco = 8 };
            var asset2 = new Asset { Id = 2, Tipo = "Renda Fixa", PrecoAtual = 500M, Risco = 3 };

            var client1 = new Client 
            { 
                Id = 1, 
                Nome = "Client A", 
                AssessorId = advisorId, 
                DataCriacao = DateTime.UtcNow.AddMonths(-1),
                Investimentos = new List<Investment>
                {
                    new Investment { Quantidade = 1500, Ativo = asset1 }, // 1,500,000
                    new Investment { Quantidade = 100, Ativo = asset2 }   // 50,000
                },
                HistoricosRiscoDeclarado = new List<DeclaredRiskHistory>
                {
                    new DeclaredRiskHistory { RiscoDeclarado = 3, DataDeclaracao = DateTime.UtcNow }
                },
                HistoricosRiscoCalculado = new List<CalculatedRiskHistory>
                {
                    new CalculatedRiskHistory { RiscoCalculado = 8, DataCalculo = DateTime.UtcNow }
                }
            };

            var client2 = new Client 
            { 
                Id = 2, 
                Nome = "Client B", 
                AssessorId = advisorId, 
                DataCriacao = DateTime.UtcNow.AddMonths(-2),
                Investimentos = new List<Investment>
                {
                    new Investment { Quantidade = 10, Ativo = asset1 }, // 10,000
                    new Investment { Quantidade = 5, Ativo = asset2 }   // 2,500
                },
                HistoricosRiscoDeclarado = new List<DeclaredRiskHistory>
                {
                    new DeclaredRiskHistory { RiscoDeclarado = 5, DataDeclaracao = DateTime.UtcNow }
                },
                HistoricosRiscoCalculado = new List<CalculatedRiskHistory>
                {
                    new CalculatedRiskHistory { RiscoCalculado = 5, DataCalculo = DateTime.UtcNow }
                }
            };


            _mockAdvisorRepository.Setup(r => r.GetByIdAsync(advisorId)).ReturnsAsync(advisor);

            var clients = new List<Client> { client1, client2 };

            // Use MockQueryable for proper EF async support
            var mockQueryable = new MockAsyncQueryable<Client>(clients);
            _mockClientRepository.Setup(r => r.GetQueryable())
                .Returns(mockQueryable);

            // Mock the individual client lookups that might be needed
            _mockClientRepository.Setup(r => r.GetByAdvisorIdAsync(advisorId))
                .ReturnsAsync(clients);
            
            foreach (var client in clients)
            {
            _mockClientRepository.Setup(r => r.GetByIdAsync(client.Id))
                .ReturnsAsync(client);
            _mockClientRepository.Setup(r => r.GetWithInvestmentsAsync(client.Id))
                .ReturnsAsync(client); 
            _mockClientRepository.Setup(r => r.GetWithRiskHistoryAsync(client.Id))
                .ReturnsAsync(client);
            }

            // Mock risk profile service calls
            _mockRiskProfileService.Setup(s => s.GetMismatchPercentageAsync(client1.Id))
                .ReturnsAsync(50M); // Critical mismatch
            _mockRiskProfileService.Setup(s => s.GetMismatchPercentageAsync(client2.Id))
                .ReturnsAsync(5M); // Low mismatch

            _mockRiskProfileService.Setup(s => s.GetInvestorProfileAsync(It.IsAny<int>()))
                .ReturnsAsync("Perfil");
            _mockRiskProfileService.Setup(s => s.GetPortfolioProfileAsync(It.IsAny<int>()))
                .ReturnsAsync("Perfil");
            _mockRiskProfileService.Setup(s => s.GetPortfolioRiskAsync(It.IsAny<int>()))
                .ReturnsAsync(5);
            _mockRiskProfileService.Setup(s => s.IsClientMismatchedAsync(client1.Id))
                .ReturnsAsync(true);
            _mockRiskProfileService.Setup(s => s.IsClientMismatchedAsync(client2.Id))
                .ReturnsAsync(false);

            // Act
            var result = await _service.GetClientClassificationSummaryAsync(advisorId);

            // Assert
            result.Should().NotBeNull();
            result.HighInvestmentCount.Should().Be(1); // Client A and Client C
            result.CriticalMismatchCount.Should().Be(1); // Client A
            result.HighExposureCount.Should().Be(1); // Client A

            result.Classifications.Should().HaveCount(3);

            var highInvestmentClassification = result.Classifications.First(c => c.Title == "Grande Volume de Investimento");
            highInvestmentClassification.Clients.Should().HaveCount(1);
            highInvestmentClassification.Clients.Should().Contain(c => c.Id == client1.Id);

            var criticalMismatchClassification = result.Classifications.First(c => c.Title == "Desenquadramento Crítico");
            criticalMismatchClassification.Clients.Should().HaveCount(1);
            criticalMismatchClassification.Clients.Should().Contain(c => c.Id == client1.Id);

            var highExposureClassification = result.Classifications.First(c => c.Title == "Alta Exposição Financeira");
            highExposureClassification.Clients.Should().HaveCount(1);
            highExposureClassification.Clients.Should().Contain(c => c.Id == client1.Id);

            result.PriorityClient.Should().NotBeNull();
            result.PriorityClient.Id.Should().Be(client1.Id);
        }
    }

    // Proper implementation for mocking EF async operations
    public class MockAsyncQueryable<T> : IQueryable<T>, IAsyncEnumerable<T>
    {
        private readonly IQueryable<T> _queryable;

        public MockAsyncQueryable(IEnumerable<T> enumerable)
        {
            _queryable = enumerable.AsQueryable();
        }

        public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default)
        {
            return new MockAsyncEnumerator<T>(_queryable.GetEnumerator());
        }

        public Type ElementType => _queryable.ElementType;
        public Expression Expression => _queryable.Expression;
        public IQueryProvider Provider => new MockAsyncQueryProvider(_queryable.Provider);

        public IEnumerator<T> GetEnumerator() => _queryable.GetEnumerator();
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => _queryable.GetEnumerator();
    }

    public class MockAsyncEnumerator<T> : IAsyncEnumerator<T>
    {
        private readonly IEnumerator<T> _enumerator;

        public MockAsyncEnumerator(IEnumerator<T> enumerator)
        {
            _enumerator = enumerator;
        }

        public T Current => _enumerator.Current;

        public ValueTask<bool> MoveNextAsync()
        {
            return new ValueTask<bool>(_enumerator.MoveNext());
        }

        public ValueTask DisposeAsync()
        {
            _enumerator.Dispose();
            return new ValueTask();
        }
    }

    public class MockAsyncQueryProvider : IQueryProvider
    {
        private readonly IQueryProvider _provider;

        public MockAsyncQueryProvider(IQueryProvider provider)
        {
            _provider = provider;
        }

        public IQueryable CreateQuery(Expression expression)
        {
            return _provider.CreateQuery(expression);
        }

        public IQueryable<TElement> CreateQuery<TElement>(Expression expression)
        {
            return new MockAsyncQueryable<TElement>(_provider.CreateQuery<TElement>(expression));
        }

        public object Execute(Expression expression)
        {
            return _provider.Execute(expression);
        }

        public TResult Execute<TResult>(Expression expression)
        {
            return _provider.Execute<TResult>(expression);
        }
    }
}