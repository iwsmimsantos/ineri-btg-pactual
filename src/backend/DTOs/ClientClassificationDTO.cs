namespace INERI.Backend.DTOs;

public class ClientClassificationDTO
{
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public List<ClientResponseDTO> Clients { get; set; } = new();
}

public class ClientClassificationSummaryDTO
{
    public ClientResponseDTO? PriorityClient { get; set; }
    public int HighInvestmentCount { get; set; }
    public int CriticalMismatchCount { get; set; }
    public int HighExposureCount { get; set; }
    public List<ClientClassificationDTO> Classifications { get; set; } = new();
} 