using INERI.Backend.Models;

namespace INERI.Backend.Repositories;

public interface IAdvisorRepository : IGenericRepository<Advisor>
{
    Task<Advisor?> GetByEmailAsync(string email);
    Task UpdatePreferencesAsync(long advisorId, int volumeInvestido, int nivelDesenquadramento, int tempoSemContato);
    Task<Advisor?> GetWithClientsAsync(long id);

    Task<Advisor?> GetAdvisorByIdAsync(long id);

} 