import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SelectionComponent from '../components/SelectionComponent';

jest.mock('../components/DropdownComponent', () => (props: any) => {
  const { Text } = require('react-native');
  return (
    <>
      <Text>Dropdown</Text>
      <Text onPress={() => props.onSelect('op2')}>Opção 2</Text>
    </>
  );
});

describe('SelectionComponent', () => {
  it('renderiza o título', () => {
    const { getByText } = render(<SelectionComponent />);
    expect(getByText('Selecione uma opção:')).toBeTruthy();
  });

  it('exibe o valor selecionado após seleção', () => {
    const { getByText, queryByText } = render(<SelectionComponent />);
    expect(queryByText('Selecionado: op2')).toBeNull();
    fireEvent.press(getByText('Opção 2'));
    expect(getByText('Selecionado: op2')).toBeTruthy();
  });
}); 