import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../components/HeaderComponent';

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

describe('HeaderComponent', () => {
  it('renderiza o logo INERI', () => {
    const { getByText } = render(<Header onMenuPress={() => {}} />);
    expect(getByText('INERI')).toBeTruthy();
  });

  it('chama onMenuPress ao pressionar o botão de menu', () => {
    const onMenuPress = jest.fn();
    const { getByRole } = render(<Header onMenuPress={onMenuPress} />);
    fireEvent.press(getByRole('button'));
    expect(onMenuPress).toHaveBeenCalled();
  });
}); 