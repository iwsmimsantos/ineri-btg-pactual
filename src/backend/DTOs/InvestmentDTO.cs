using System;

namespace INERI.Backend.DTOs
{
    public class InvestmentDTO
    {
        public long Id { get; set; }
        public int AtivoId { get; set; }
        public decimal Quantidade { get; set; }
        public decimal PrecoCompra { get; set; }
        public DateTime DataCompra { get; set; }
    }
}