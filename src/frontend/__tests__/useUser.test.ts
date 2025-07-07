import { renderHook } from '@testing-library/react-native';
import { useUser } from '../hooks/useUser';

// Mock do Clerk
jest.mock('@clerk/clerk-expo', () => ({
  useUser: jest.fn(),
}));

const mockUseClerkUser = require('@clerk/clerk-expo').useUser;

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna dados do usuário quando autenticado', () => {
    const mockUser = {
      firstName: 'João',
      lastName: 'Silva',
      primaryEmailAddress: {
        emailAddress: 'joao@example.com',
      },
    };

    mockUseClerkUser.mockReturnValue({
      user: mockUser,
      isLoaded: true,
      isSignedIn: true,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current).toEqual({
      firstName: 'João',
      lastName: 'Silva',
      fullName: 'João Silva',
      email: 'joao@example.com',
      initials: 'JS',
      isAuthenticated: true,
      isLoaded: true,
      isSignedIn: true,
      user: mockUser,
    });
  });

  it('retorna dados vazios quando não autenticado', () => {
    mockUseClerkUser.mockReturnValue({
      user: null,
      isLoaded: true,
      isSignedIn: false,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current).toEqual({
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      initials: '',
      isAuthenticated: false,
      isLoaded: true,
      isSignedIn: false,
      user: null,
    });
  });

  it('retorna dados vazios quando não carregado', () => {
    mockUseClerkUser.mockReturnValue({
      user: null,
      isLoaded: false,
      isSignedIn: false,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current).toEqual({
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      initials: '',
      isAuthenticated: false,
      isLoaded: false,
      isSignedIn: false,
      user: null,
    });
  });

  it('lida com usuário sem nome', () => {
    const mockUser = {
      firstName: null,
      lastName: null,
      primaryEmailAddress: {
        emailAddress: 'user@example.com',
      },
    };

    mockUseClerkUser.mockReturnValue({
      user: mockUser,
      isLoaded: true,
      isSignedIn: true,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current).toEqual({
      firstName: '',
      lastName: '',
      fullName: '',
      email: 'user@example.com',
      initials: '',
      isAuthenticated: true,
      isLoaded: true,
      isSignedIn: true,
      user: mockUser,
    });
  });

  it('lida com usuário sem email', () => {
    const mockUser = {
      firstName: 'João',
      lastName: 'Silva',
      primaryEmailAddress: null,
    };

    mockUseClerkUser.mockReturnValue({
      user: mockUser,
      isLoaded: true,
      isSignedIn: true,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current).toEqual({
      firstName: 'João',
      lastName: 'Silva',
      fullName: 'João Silva',
      email: '',
      initials: 'JS',
      isAuthenticated: true,
      isLoaded: true,
      isSignedIn: true,
      user: mockUser,
    });
  });
}); 