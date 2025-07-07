using System.Threading.Tasks;
using INERI.Backend.DTOs;

namespace INERI.Backend.Services
{
    public interface IClientService
    {

        Task<ClientDetailsDTO?> GetClientDetailsAsync(long id);
    }
}
