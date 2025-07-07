using Microsoft.EntityFrameworkCore;
using INERI.Backend.Data;
using INERI.Backend.Models;

namespace INERI.Backend.Repositories;

public class AdvisorRepository : GenericRepository<Advisor>, IAdvisorRepository
{
    public AdvisorRepository(InvestmentDbContext context) : base(context) { }

    public async Task<Advisor?> GetAdvisorByIdAsync(long id)
    {
        return await _context.Set<Advisor>()
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Advisor?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(a => a.Email == email);
    }

    public async Task<Advisor?> GetWithClientsAsync(long id)
    {
        return await _dbSet
            .Include(a => a.Clientes)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task UpdatePreferencesAsync(long advisorId, int volumeInvestido, int nivelDesenquadramento, int tempoSemContato)
    {
        var advisor = await _dbSet.FindAsync(advisorId);
        if (advisor != null)
        {
            advisor.PreferenciaVolumeInvestido = volumeInvestido;
            advisor.PreferenciaNivelDesenquadramento = nivelDesenquadramento;
            advisor.PreferenciaTempoSemContato = tempoSemContato;
            await _context.SaveChangesAsync();
        }
    }

} 