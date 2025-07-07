using System;
using System.Collections.Generic;

namespace INERI.Backend.DTOs
{
    public class ClientDetailsDTO
    {
        public long Id { get; set; }
        public string NomeCompleto { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Cpf { get; set; } = default!;
        public decimal SaldoCarteira { get; set; }
        public DateTime UltimoContato { get; set; }
        public List<DTOs.InvestmentDTO> Investments { get; set; } = new();
    }
}
