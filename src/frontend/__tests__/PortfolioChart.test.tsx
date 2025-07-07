import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PortfolioChart from '../components/PortfolioChart';

jest.mock('../theme/colors', () => ({
  Colors: {
    azul: '#004A80',
    cinzaContraste: '#C2CEDA',
    azulClaro: '#1A77C1',
    verde: '#34A853',
    vermelho: '#C32032',
    amarelo: '#FFB800',
    cinzaFundo: '#F4F6F8',
    cinzaTexto: '#667788',
    branco: '#FEFEFE',
    preto: '#000000',
    cinzaBotoes: '#7D7D7D',
  },
}));
jest.mock('../theme/fonts', () => ({
  Fonts: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
}));

describe('PortfolioChart', () => {
  it('renderiza o título', () => {
    const { getByText } = render(<PortfolioChart />);
    expect(getByText('Composição da carteira')).toBeTruthy();
  });

  it('renderiza valores percentuais por padrão', () => {
    const { getByText } = render(<PortfolioChart />);
    expect(getByText('40%')).toBeTruthy();
    expect(getByText('30%')).toBeTruthy();
    expect(getByText('20%')).toBeTruthy();
    expect(getByText('10%')).toBeTruthy();
  });

  it('altera para valores em reais ao clicar no toggle', () => {
    const { getByText } = render(<PortfolioChart />);
    fireEvent.press(getByText('R$'));
    expect(getByText('R$ 40.000')).toBeTruthy();
    expect(getByText('R$ 30.000')).toBeTruthy();
    expect(getByText('R$ 20.000')).toBeTruthy();
    expect(getByText('R$ 10.000')).toBeTruthy();
  });

  it('volta para valores percentuais ao clicar no toggle de %', () => {
    const { getByText } = render(<PortfolioChart />);
    fireEvent.press(getByText('R$'));
    fireEvent.press(getByText('%'));
    expect(getByText('40%')).toBeTruthy();
    expect(getByText('30%')).toBeTruthy();
    expect(getByText('20%')).toBeTruthy();
    expect(getByText('10%')).toBeTruthy();
  });
}); 