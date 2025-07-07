import { useState, useEffect, useCallback, useMemo } from 'react';
import { ClientService } from '../services/ClientService';
import { Client } from '../models/Client';

export interface ProfileViewModelState {
  clientInfo: Client | null;
  loading: boolean;
  error: string | null;
  recommendationsLoading: boolean;
  recommendations: RecommendationData | null;
  reportLoading: boolean;
  generatedReport: GeneratedReport | null;
}

export interface InvestmentData {
  id: number;
  ativo: {
    id: number;
    codigo: string;
    nome: string;
    tipo: string;
    categoria?: string;
    precoAtual: number;
    rentabilidade?: number;
  };
  quantidade: number;
  precoCompra: number;
  valorTotal: number;
}

export interface PortfolioData {
  label: string;
  value: number;
  color: string;
}

export interface ClientProfileData {
  id: string;
  name: string;
  profileType: string;
  portfolioType: string;
  percentage: number;
  status: 'desenquadrado' | 'normal';
}

export interface RecommendationData {
  propFixa: number;
  propVariavel: number;
  propOutros: number;
  nivelDesenquadramento: number;
  ativosRecomendados: {
    nome: string;
    score: number;
  }[];
  recomendacaoAjuste: string;
}

export interface GeneratedReport {
  id: string;
  title: string;
  clientName: string;
  generatedAt: string;
  content: string;
  htmlContent: string;
  summary: string;
  recommendations: boolean;
}

export const useProfileViewModel = (clientId: string) => {
  const [state, setState] = useState<ProfileViewModelState>({
    clientInfo: null,
    loading: false,
    error: null,
    recommendationsLoading: false,
    recommendations: null,
    reportLoading: false,
    generatedReport: null,
  });

  const clientService = ClientService.getInstance();

  // Transform client data from backend format to UI format
  const transformClientData = useCallback((backendClient: Client): ClientProfileData => {
    return {
      id: backendClient.id?.toString() ?? '',
      name: backendClient.nome,
      profileType: `Perfil: ${backendClient.perfilDeInvestidor || 'N/A'}`,
      portfolioType: `Perfil da Carteira: ${backendClient.perfilCarteira || 'N/A'}`,
      percentage: Math.round(backendClient.percentualDesenquadramento || 0),
      status: backendClient.isDesenquadrado ? 'desenquadrado' : 'normal',
    };
  }, []);

  // Transform investment data for UI
  const transformInvestmentData = useCallback((investments: any[]): InvestmentData[] => {
    if (!investments || !Array.isArray(investments)) return [];

    return investments.map((inv: any) => ({
      id: inv.id,
      ativo: {
        id: inv.ativo?.id || inv.ativoId,
        codigo: inv.ativo?.codigo || 'N/A',
        nome: inv.ativo?.nome || 'Ativo Desconhecido',
        tipo: inv.ativo?.tipo || inv.ativo?.categoria || 'Outro',
        categoria: inv.ativo?.categoria || inv.ativo?.tipo,
        precoAtual: Number(inv.ativo?.precoAtual || 0),
        rentabilidade: Number(inv.ativo?.rentabilidade || 0),
      },
      quantidade: Number(inv.quantidade || 0),
      precoCompra: Number(inv.precoCompra || 0),
      valorTotal: inv.valorTotal || (Number(inv.quantidade || 0) * Number(inv.ativo?.precoAtual || 0)),
    }));
  }, []);

  // Generate portfolio data for chart
  const portfolioData = useMemo((): PortfolioData[] => {
    if (!state.clientInfo?.investimentos) return [];

    const investments = transformInvestmentData(state.clientInfo.investimentos);
    const categoryMap: { [key: string]: { label: string; value: number; color: string } } = {};

    const getCategoryColor = (categoria: string): string => {
      const colorMap: Record<string, string> = {
        'renda fixa': '#FFB800',
        'ações': '#4A90E2',
        'fiis': '#E94B3C',
        'fundos': '#2B5CE6',
        'fundos imobiliários': '#E94B3C',
        'outro': '#8E8E93',
      };
      return colorMap[categoria.toLowerCase()] || '#2B5CE6';
    };

    investments.forEach((inv) => {
      const categoria = inv.ativo?.tipo || inv.ativo?.categoria || 'Outro';
      if (!categoryMap[categoria]) {
        categoryMap[categoria] = {
          label: categoria,
          value: 0,
          color: getCategoryColor(categoria)
        };
      }
      categoryMap[categoria].value += inv.valorTotal;
    });

    return Object.values(categoryMap);
  }, [state.clientInfo?.investimentos, transformInvestmentData]);

  // Derived data
  const clientProfileData = useMemo(() => {
    return state.clientInfo ? transformClientData(state.clientInfo) : null;
  }, [state.clientInfo, transformClientData]);

  const investmentData = useMemo(() => {
    return state.clientInfo?.investimentos ? transformInvestmentData(state.clientInfo.investimentos) : [];
  }, [state.clientInfo?.investimentos, transformInvestmentData]);

  // Load client data with investments
  const loadClientData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const clientData = await clientService.getClientWithInvestments(Number(clientId));
      setState(prev => ({
        ...prev,
        clientInfo: clientData,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load client data:', error);
      setState(prev => ({
        ...prev,
        error: 'Não foi possível carregar os dados do cliente. Tente novamente.',
        loading: false,
      }));
    }
  }, [clientId, clientService]);

  // Generate recommendations and save locally
  const generateRecommendations = useCallback(async () => {
    setState(prev => ({ ...prev, recommendationsLoading: true }));

    try {
      let recommendationData = null;

      // Try to fetch from backend API first
      const response = await fetch(`http://localhost:5000/api/recommendations/by-client/${clientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        recommendationData = await response.json();
      } else {
        // If backend fails, try ML API directly
        const mlResponse = await fetch(`http://localhost:5555/api/recommendations/${clientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (mlResponse.ok) {
          recommendationData = await mlResponse.json();
        }
      }

      if (recommendationData) {
        // Save to local storage
        localStorage.setItem(`recommendations_${clientId}`, JSON.stringify(recommendationData));

        setState(prev => ({
          ...prev,
          recommendations: recommendationData,
          recommendationsLoading: false,
        }));

        return { success: true, message: 'Recomendações geradas e salvas com sucesso!' };
      } else {
        throw new Error('Não foi possível obter recomendações dos serviços');
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      setState(prev => ({
        ...prev,
        recommendationsLoading: false,
      }));
      return { success: false, message: 'Erro ao gerar recomendações. Tente novamente.' };
    }
  }, [clientId]);

  // Load recommendations from local storage
  const loadStoredRecommendations = useCallback(() => {
    try {
      const stored = localStorage.getItem(`recommendations_${clientId}`);
      if (stored) {
        const recommendationData = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          recommendations: recommendationData,
        }));
      }
    } catch (error) {
      console.error('Failed to load stored recommendations:', error);
    }
  }, [clientId]);

  // Generate AI report using Gemini
  const generateAIReport = useCallback(async () => {
    setState(prev => ({ ...prev, reportLoading: true }));

    try {
      if (!state.clientInfo) {
        throw new Error('Dados do cliente não disponíveis');
      }

      // Load stored recommendations if available
      const storedRecommendations = localStorage.getItem(`recommendations_${clientId}`);
      const recommendations = storedRecommendations ? JSON.parse(storedRecommendations) : state.recommendations;

      // Prepare data for Gemini
      const portfolioTotal = portfolioData.reduce((total, item) => total + item.value, 0);
      const topInvestments = investmentData.slice(0, 10);

      const prompt = `
Como um assessor de investimentos experiente, crie um relatório detalhado e profissional para o cliente ${state.clientInfo.nome}.

DADOS DO CLIENTE:
- Nome: ${state.clientInfo.nome}
- Perfil de Investidor: ${state.clientInfo.perfilDeInvestidor || 'N/A'}
- Perfil da Carteira: ${state.clientInfo.perfilCarteira || 'N/A'}
- Percentual de Desenquadramento: ${state.clientInfo.percentualDesenquadramento?.toFixed(2) || 0}%

COMPOSIÇÃO DA CARTEIRA (Total: R$ ${portfolioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}):
${portfolioData.map(item => `- ${item.label}: R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${((item.value / portfolioTotal) * 100).toFixed(1)}%)`).join('\n')}

PRINCIPAIS INVESTIMENTOS:
${topInvestments.map(inv => `- ${inv.ativo.codigo} (${inv.ativo.tipo}): ${inv.quantidade} unidades, R$ ${inv.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, Rentabilidade: ${inv.ativo.rentabilidade || 0}%`).join('\n')}

${recommendations ? `
RECOMENDAÇÕES DE IA DISPONÍVEIS:
- Alocação Recomendada: ${(recommendations.propFixa * 100).toFixed(1)}% Renda Fixa, ${(recommendations.propVariavel * 100).toFixed(1)}% Renda Variável, ${(recommendations.propOutros * 100).toFixed(1)}% Outros
- Ativos Recomendados: ${recommendations.ativosRecomendados?.map((a: any) => `${a.nome} (Score: ${a.score.toFixed(3)})`).join(', ')}
- Recomendação de Ajuste: ${recommendations.recomendacaoAjuste}
` : 'RECOMENDAÇÕES DE IA: Não disponíveis (gere as recomendações primeiro para incluir análises mais precisas)'}

INSTRUÇÕES:
Crie um relatório profissional, conciso e direto para um assessor experiente. Inclua:
1. Resumo Executivo (situação atual e principais pontos de atenção)
2. Análise da Carteira (distribuição, concentrações, riscos)
3. Recomendações Específicas (ações práticas e prioritárias)
4. Próximos Passos

IMPORTANTE:
- NÃO inclua data no conteúdo do relatório (a data já está no cabeçalho)
- NÃO inclua título com nome do cliente (já está no cabeçalho)
- Comece diretamente com "**Resumo Executivo**"
- Use formatação em markdown com **negrito** para títulos e pontos importantes
- Seja objetivo, técnico e foque em insights acionáveis
`;

      // Call Gemini API
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!geminiResponse.ok) {
        throw new Error('Erro ao comunicar com o serviço de IA');
      }

      const geminiData = await geminiResponse.json();
      const aiContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro ao gerar conteúdo';

      // Convert markdown to HTML
      const convertMarkdownToHtml = (markdown: string): string => {
        return markdown
          // Bold text: **text** -> <strong>text</strong>
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          // Italic text: *text* -> <em>text</em>
          .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
          // Headers: ### -> <h3>, ## -> <h2>, # -> <h1>
          .replace(/^### (.*$)/gm, '<h3>$1</h3>')
          .replace(/^## (.*$)/gm, '<h2>$1</h2>')
          .replace(/^# (.*$)/gm, '<h1>$1</h1>')
          // Bullet points: - text -> <li>text</li>
          .replace(/^- (.*$)/gm, '<li>$1</li>')
          // Wrap consecutive <li> in <ul>
          .replace(/(<li>.*<\/li>)(\n<li>.*<\/li>)*/g, (match) => {
            return '<ul>' + match.replace(/\n/g, '') + '</ul>';
          })
          // Numbered lists: 1. text -> <li>text</li>
          .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
          // Line breaks
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br>')
          // Wrap in paragraphs
          .replace(/^(.)/g, '<p>$1')
          .replace(/(.)$/g, '$1</p>')
          // Clean up empty paragraphs and fix structure
          .replace(/<p><\/p>/g, '')
          .replace(/<p><br>/g, '<p>')
          .replace(/<br><\/p>/g, '</p>')
          .replace(/<p>(<h[1-6]>)/g, '$1')
          .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
          .replace(/<p>(<ul>)/g, '$1')
          .replace(/(<\/ul>)<\/p>/g, '$1');
      };

      const htmlContent = convertMarkdownToHtml(aiContent);

      // Create comprehensive HTML report
      const fullHtmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Relatório de Investimentos - ${state.clientInfo.nome}</title>
          <style>
            @page { margin: 20px; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #2B5CE6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2B5CE6;
              margin: 0;
              font-size: 28px;
            }
            .ai-content {
              font-size: 14px;
              line-height: 1.8;
              margin: 20px 0;
            }
            .ai-content strong {
              color: #2B5CE6;
              font-weight: bold;
            }
                        .ai-content p {
              margin-bottom: 12px;
            }
            .ai-content h1, .ai-content h2, .ai-content h3 {
              color: #2B5CE6;
              margin: 20px 0 10px 0;
              font-weight: bold;
            }
            .ai-content h1 { font-size: 18px; }
            .ai-content h2 { font-size: 16px; }
            .ai-content h3 { font-size: 14px; }
            .ai-content ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .ai-content li {
              margin-bottom: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e9ecef;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Investimentos</h1>
            <h2>${state.clientInfo.nome}</h2>
            <p><strong>Gerado em:</strong> ${new Date().toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>

          <div class="ai-content">${htmlContent}</div>

          <div class="footer">
            <p><strong>Relatório gerado com IA pelo sistema INERI</strong></p>
            <p>Powered by Google Gemini Flash</p>
            <p style="font-size: 10px; margin-top: 10px;">
              Este documento é confidencial e foi gerado com auxílio de inteligência artificial.
              Sempre consulte seu assessor antes de tomar decisões de investimento.
            </p>
          </div>
        </body>
        </html>
      `;

      // Create report object
      const report: GeneratedReport = {
        id: `report_${clientId}_${Date.now()}`,
        title: `Relatório de Investimentos - ${state.clientInfo.nome}`,
        clientName: state.clientInfo.nome,
        generatedAt: new Date().toISOString(),
        content: aiContent,
        htmlContent: fullHtmlContent,
        summary: aiContent.substring(0, 200) + '...',
        recommendations: !!recommendations,
      };

      setState(prev => ({
        ...prev,
        generatedReport: report,
        reportLoading: false,
      }));

      return { success: true, message: 'Relatório com IA gerado com sucesso!' };
    } catch (error) {
      console.error('Failed to generate AI report:', error);
      setState(prev => ({
        ...prev,
        reportLoading: false,
      }));
      return { success: false, message: 'Erro ao gerar relatório com IA. Verifique a conexão e tente novamente.' };
    }
  }, [state.clientInfo, state.recommendations, portfolioData, investmentData, clientId]);

  // Download report
  const downloadReport = useCallback(() => {
    if (!state.generatedReport) return;

    const blob = new Blob([state.generatedReport.htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${state.generatedReport.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }, [state.generatedReport]);

  // Open report in new window
  const openReport = useCallback(() => {
    if (!state.generatedReport) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(state.generatedReport.htmlContent);
      printWindow.document.close();
    }
  }, [state.generatedReport]);

  // Clear generated report
  const clearReport = useCallback(() => {
    setState(prev => ({ ...prev, generatedReport: null }));
  }, []);

  // Refresh client data
  const refreshClientData = useCallback(() => {
    return loadClientData();
  }, [loadClientData]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Initialize data on mount
  useEffect(() => {
    if (clientId) {
      loadClientData();
      loadStoredRecommendations();
    }
  }, [clientId, loadClientData, loadStoredRecommendations]);

  return {
    // State
    clientInfo: state.clientInfo,
    clientProfileData,
    investmentData,
    portfolioData,
    loading: state.loading,
    error: state.error,
    recommendationsLoading: state.recommendationsLoading,
    recommendations: state.recommendations,
    reportLoading: state.reportLoading,
    generatedReport: state.generatedReport,

    // Actions
    generateRecommendations,
    generateAIReport,
    downloadReport,
    openReport,
    clearReport,
    refreshClientData,
    clearError,
  };
};
