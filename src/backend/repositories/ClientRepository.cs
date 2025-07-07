using Microsoft.EntityFrameworkCore;
using INERI.Backend.Data;
using INERI.Backend.Models;

namespace INERI.Backend.Repositories;

public class ClientRepository : GenericRepository<Client>, IClientRepository
{
    public ClientRepository(InvestmentDbContext context) : base(context) { }

    public async Task<Client?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(c => c.Email == email);
    }

    public async Task<Client?> GetByCpfAsync(string cpf)
    {
        return await _dbSet.FirstOrDefaultAsync(c => c.Cpf == cpf);
    }

    public async Task<IEnumerable<Client>> GetByAdvisorIdAsync(long advisorId)
    {
        return await _dbSet
            .Include(c => c.Investimentos)
                .ThenInclude(i => i.Ativo)
            .Include(c => c.HistoricosRiscoCalculado)
            .Include(c => c.HistoricosRiscoDeclarado)
            .Where(c => c.AssessorId == advisorId)
            .ToListAsync();
    }

    public async Task<Client?> GetWithInvestmentsAsync(long id)
    {
        return await _dbSet
            .Include(c => c.Investimentos)
            .ThenInclude(i => i.Ativo)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Client?> GetWithRiskHistoryAsync(long id)
    {
        return await _dbSet
            .Include(c => c.HistoricosRiscoCalculado)
            .Include(c => c.HistoricosRiscoDeclarado)
            .Include(c => c.Investimentos)
            .ThenInclude(i => i.Ativo)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task AddCalculatedRiskAsync(CalculatedRiskHistory calculatedRisk)
    {
        _context.Set<CalculatedRiskHistory>().Add(calculatedRisk);
        await _context.SaveChangesAsync();
    }

    public async Task AddDeclaredRiskAsync(DeclaredRiskHistory declaredRisk)
    {
        _context.Set<DeclaredRiskHistory>().Add(declaredRisk);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<CalculatedRiskHistory>> GetCalculatedRiskHistoryAsync(long clientId)
    {
        return await _context.Set<CalculatedRiskHistory>()
            .Where(h => h.ClienteId == clientId)
            .OrderByDescending(h => h.DataCalculo)
            .ToListAsync();
    }

    public async Task<IEnumerable<DeclaredRiskHistory>> GetDeclaredRiskHistoryAsync(long clientId)
    {
        return await _context.Set<DeclaredRiskHistory>()
            .Where(h => h.ClienteId == clientId)
            .OrderByDescending(h => h.DataDeclaracao)
            .ToListAsync();
    }

    public IQueryable<Client> GetQueryable()
    {
        return _dbSet.AsQueryable();
    }

    public async Task<List<Client>> GetByAdvisorIdPagedAsync(long advisorId, int page, int pageSize)
    {
        return await _dbSet
            .Where(c => c.AssessorId == advisorId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetCountByAdvisorIdAsync(long advisorId)
    {
        return await _dbSet.CountAsync(c => c.AssessorId == advisorId);
    }
}
