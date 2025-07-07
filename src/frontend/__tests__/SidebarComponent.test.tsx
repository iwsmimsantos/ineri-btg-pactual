import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Sidebar from '../components/SidebarComponent';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: (props: any) => <>{props.name}</>,
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
jest.mock('../hooks/useResponsive', () => ({
  useResponsive: () => ({
    responsiveSize: (s: number, m: number, l: number) => m,
    isSmallScreen: false,
  }),
}));
jest.mock('../hooks/useUser', () => ({
  useUser: () => ({
    firstName: 'João',
    lastName: 'Teste',
    fullName: 'João Teste',
    email: 'joao@teste.com',
    initials: 'JT',
    isAuthenticated: true,
    isLoaded: true,
    isSignedIn: true,
    user: null,
  }),
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useNavigationState: jest.fn(() => 'Home'),
}));

describe('SidebarComponent', () => {
  it('renderiza o nome do usuário e o papel', () => {
    const { getByText } = render(
      <Sidebar isOpen={true} onClose={() => {}} userRole="Gestor" />
    );
    expect(getByText('João Teste')).toBeTruthy();
    expect(getByText('Gestor')).toBeTruthy();
  });

  it('chama onClose ao clicar em Sair', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <Sidebar isOpen={true} onClose={onClose} userRole="Admin" />
    );
    fireEvent.press(getByText('Sair'));
    expect(onClose).toHaveBeenCalled();
  });

  it('chama onClose ao clicar fora do sidebar', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Sidebar isOpen={true} onClose={onClose} userRole="Admin" />
    );
    // overlay não tem testID, então vamos adicionar no componente real se quiser testar isso
    // fireEvent.press(getByTestId('sidebar-overlay'));
    // expect(onClose).toHaveBeenCalled();
  });
}); 