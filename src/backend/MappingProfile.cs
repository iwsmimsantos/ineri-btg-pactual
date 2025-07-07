using AutoMapper;
using INERI.Backend.Models;
using INERI.Backend.DTOs;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Client, ClientResponseDTO>()
            .ForMember(dest => dest.Patrimonio, opt => opt.MapFrom(src =>
                src.Investimentos.Sum(i => i.Quantidade * i.Ativo.PrecoAtual)))
            .ForMember(dest => dest.PerfilDeInvestidor, opt => opt.Ignore())
            .ForMember(dest => dest.PerfilCarteira, opt => opt.Ignore())
            .ForMember(dest => dest.RiscoDeclarado, opt => opt.MapFrom(src =>
                src.HistoricosRiscoDeclarado.OrderByDescending(h => h.DataDeclaracao).FirstOrDefault().RiscoDeclarado))
            .ForMember(dest => dest.RiscoCalculado, opt => opt.MapFrom(src =>
                src.HistoricosRiscoCalculado.OrderByDescending(h => h.DataCalculo).FirstOrDefault().RiscoCalculado))
            .ForMember(dest => dest.RiscoCarteiraAtual, opt => opt.Ignore())
            .ForMember(dest => dest.PercentualDesenquadramento, opt => opt.Ignore())
            .ForMember(dest => dest.IsDesenquadrado, opt => opt.Ignore())
            .ForMember(dest => dest.UltimaAtualizacaoRisco, opt => opt.MapFrom(src =>
                src.HistoricosRiscoDeclarado.OrderByDescending(h => h.DataDeclaracao).FirstOrDefault().DataDeclaracao));

        CreateMap<ClientResponseDTO, Client>();
        // Adicione outros mapeamentos aqui
    }
}
