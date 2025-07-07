import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ClientCardComponent from '../components/ClientCardComponent';
import { Text } from 'react-native';

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

jest.mock('../components/DropdownComponent', () => (props: any) => {
  const { Text } = require('react-native');
  return (
    <>
      <Text>Dropdown</Text>
      <Text onPress={() => props.onSelect('op2')}>Opção 2</Text>
    </>
  );
});

describe('ClientCardComponent', () => {
  it('renderiza nome, perfil e portfólio', () => {
    const { getByText } = render(
      <ClientCardComponent
        clientName="Maria Silva"
        profileType="Conservador"
        portfolioType="Renda Fixa"
        percentage={10}
      />
    );
    expect(getByText('Maria Silva')).toBeTruthy();
    expect(getByText('Conservador')).toBeTruthy();
    expect(getByText('Renda Fixa')).toBeTruthy();
  });

  it('renderiza as iniciais corretamente', () => {
    const { getByText } = render(
      <ClientCardComponent
        clientName="Maria Silva"
        profileType="Conservador"
        portfolioType="Renda Fixa"
        percentage={10}
      />
    );
    expect(getByText('MS')).toBeTruthy();
  });

  it('chama onPress quando pressionado', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <ClientCardComponent
        clientName="Maria Silva"
        profileType="Conservador"
        portfolioType="Renda Fixa"
        percentage={10}
        onPress={onPressMock}
      />
    );
    fireEvent.press(getByText('Maria Silva'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('renderiza a porcentagem corretamente', () => {
    const { getByText } = render(
      <ClientCardComponent
        clientName="Maria Silva"
        profileType="Conservador"
        portfolioType="Renda Fixa"
        percentage={15}
      />
    );
    expect(getByText('15%')).toBeTruthy();
  });
});