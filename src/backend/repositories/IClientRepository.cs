using System.Linq.Expressions;
using INERI.Backend.Models;

namespace INERI.Backend.Repositories;

public interface IClientRepository
{
    Task<Client?> GetByIdAsync(long id);
    Task<IEnumerable<Client>> GetAllAsync();
    Task<IEnumerable<Client>> FindAsync(Expression<Func<Client, bool>> predicate);
    Task<Client> AddAsync(Client entity);
    Task UpdateAsync(Client entity);
    Task DeleteAsync(long id);
    Task<bool> ExistsAsync(long id);
    Task<Client?> GetByEmailAsync(string email);
    Task<Client?> GetByCpfAsync(string cpf);
    Task<IEnumerable<Client>> GetByAdvisorIdAsync(long advisorId);
    Task<Client?> GetWithInvestmentsAsync(long id);
    Task<Client?> GetWithRiskHistoryAsync(long id);
    Task AddCalculatedRiskAsync(CalculatedRiskHistory calculatedRisk);
    Task AddDeclaredRiskAsync(DeclaredRiskHistory declaredRisk);
    Task<IEnumerable<CalculatedRiskHistory>> GetCalculatedRiskHistoryAsync(long clientId);
    Task<IEnumerable<DeclaredRiskHistory>> GetDeclaredRiskHistoryAsync(long clientId);
    IQueryable<Client> GetQueryable();
    Task<List<Client>> GetByAdvisorIdPagedAsync(long advisorId, int page, int pageSize);
    Task<int> GetCountByAdvisorIdAsync(long advisorId);
}

