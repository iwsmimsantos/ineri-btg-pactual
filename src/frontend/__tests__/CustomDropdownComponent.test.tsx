import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CustomDropdownComponent from '../components/CustomDropdownComponent';

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
jest.mock('@expo/vector-icons', () => ({
  Ionicons: (props: any) => <>{props.name}</>,
}));

describe('CustomDropdownComponent', () => {
  const options = [
    { label: 'Opção 1', value: '1' },
    { label: 'Opção 2', value: '2' },
  ];

  it('renderiza o label e placeholder', () => {
    const { getByText } = render(
      <CustomDropdownComponent
        label="Selecione"
        options={options}
        selectedValue=""
        onValueChange={() => {}}
      />
    );
    expect(getByText('Selecione')).toBeTruthy();
    expect(getByText('Selecione uma opção')).toBeTruthy();
  });

  it('abre o modal ao pressionar o dropdown', async () => {
    const { getByText } = render(
      <CustomDropdownComponent
        label="Selecione"
        options={options}
        selectedValue=""
        onValueChange={() => {}}
      />
    );
    fireEvent.press(getByText('Selecione uma opção'));
    await waitFor(() => {
      expect(getByText('Opção 1')).toBeTruthy();
      expect(getByText('Opção 2')).toBeTruthy();
    });
  });

  it('chama onValueChange ao selecionar uma opção', async () => {
    const onValueChange = jest.fn();
    const { getByText } = render(
      <CustomDropdownComponent
        label="Selecione"
        options={options}
        selectedValue=""
        onValueChange={onValueChange}
      />
    );
    fireEvent.press(getByText('Selecione uma opção'));
    await waitFor(() => {
      expect(getByText('Opção 1')).toBeTruthy();
    });
    fireEvent.press(getByText('Opção 1'));
    expect(onValueChange).toHaveBeenCalledWith('1');
  });
}); 