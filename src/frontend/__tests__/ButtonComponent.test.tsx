import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ButtonComponent from '../components/ButtonComponent';

jest.mock('../hooks/useResponsive', () => ({
  useResponsive: () => ({
    responsiveSize: (s: number, m: number, l: number) => m,
  }),
}));

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

describe('ButtonComponent', () => {
  it('renderiza o texto corretamente', () => {
    const { getByText } = render(
      <ButtonComponent title="Clique aqui" onPress={() => {}} />
    );
    expect(getByText('Clique aqui')).toBeTruthy();
  });

  it('chama onPress quando pressionado', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <ButtonComponent title="Clique aqui" onPress={onPressMock} />
    );
    fireEvent.press(getByText('Clique aqui'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('mostra ActivityIndicator quando loading', () => {
    const { getByTestId, queryByText } = render(
      <ButtonComponent title="Carregando" loading />
    );
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
    expect(queryByText('Carregando')).toBeNull();
  });
}); 