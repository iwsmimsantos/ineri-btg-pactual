import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CollapsibleClientListComponent from '../components/CollapsibleClientListComponent';

jest.mock('../components/ClientCardComponent', () => (props: any) => {
  const { Text } = require('react-native');
  return <Text>{props.clientName}</Text>;
});

describe('CollapsibleClientListComponent', () => {
  const clients = [
    {
      id: '1',
      name: 'Maria Silva',
      profileType: 'Conservador',
      portfolioType: 'Renda Fixa',
      percentage: 10,
      initials: 'MS',
    },
    {
      id: '2',
      name: 'João Souza',
      profileType: 'Moderado',
      portfolioType: 'Ações',
      percentage: 25,
      initials: 'JS',
    },
  ];

  it('renderiza título e subtítulo', () => {
    const { getByText } = render(
      <CollapsibleClientListComponent
        title="Clientes"
        subtitle="Lista de clientes"
        clients={clients}
      />
    );
    expect(getByText('Clientes')).toBeTruthy();
    expect(getByText('Lista de clientes')).toBeTruthy();
  });

  it('expande e mostra os clientes ao clicar no header', () => {
    const { getByText, queryByText } = render(
      <CollapsibleClientListComponent
        title="Clientes"
        subtitle="Lista de clientes"
        clients={clients}
      />
    );
    expect(queryByText('Maria Silva')).toBeNull();
    expect(queryByText('João Souza')).toBeNull();

    fireEvent.press(getByText('Clientes'));

    expect(getByText('Maria Silva')).toBeTruthy();
    expect(getByText('João Souza')).toBeTruthy();
  });
});