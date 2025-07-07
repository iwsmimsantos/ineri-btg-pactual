import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SliderComponent from '../components/SliderComponent';

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
jest.mock('../hooks/useResponsive', () => ({
  useResponsive: () => ({
    responsiveSize: (s: number, m: number, l: number) => m,
  }),
}));

describe('SliderComponent', () => {
  it('renderiza o label e valor', () => {
    const { getByText } = render(
      <SliderComponent label="Teste" value={50} onValueChange={() => {}} />
    );
    expect(getByText('Teste')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
  });

  it('decrementa o valor ao pressionar -', () => {
    const onValueChange = jest.fn();
    const { getByText } = render(
      <SliderComponent label="Teste" value={50} onValueChange={onValueChange} />
    );
    fireEvent.press(getByText('-'));
    expect(onValueChange).toHaveBeenCalledWith(40);
  });

  it('incrementa o valor ao pressionar +', () => {
    const onValueChange = jest.fn();
    const { getByText } = render(
      <SliderComponent label="Teste" value={50} onValueChange={onValueChange} />
    );
    fireEvent.press(getByText('+'));
    expect(onValueChange).toHaveBeenCalledWith(60);
  });

  it('não decrementa abaixo do mínimo', () => {
    const onValueChange = jest.fn();
    const { getByText } = render(
      <SliderComponent label="Teste" value={0} onValueChange={onValueChange} min={0} />
    );
    fireEvent.press(getByText('-'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('não incrementa acima do máximo', () => {
    const onValueChange = jest.fn();
    const { getByText } = render(
      <SliderComponent label="Teste" value={100} onValueChange={onValueChange} max={100} />
    );
    fireEvent.press(getByText('+'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
}); 