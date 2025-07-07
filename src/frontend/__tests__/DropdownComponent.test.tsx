import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Dropdown from '../components/DropdownComponent';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: (props: any) => <>{props.name}</>,
}));

describe('Dropdown', () => {
  const options = [
    { label: 'Primeira', value: '1' },
    { label: 'Segunda', value: '2' },
  ];

  it('renderiza o placeholder quando nenhum valor está selecionado', () => {
    const { getByText } = render(
      <Dropdown options={options} value="" onSelect={() => {}} />
    );
    expect(getByText('Todos os Dados')).toBeTruthy();
  });

  it('renderiza o label da opção selecionada', () => {
    const { getByText } = render(
      <Dropdown options={options} value="2" onSelect={() => {}} />
    );
    expect(getByText('Segunda')).toBeTruthy();
  });

  it('abre a lista de opções ao pressionar o dropdown', () => {
    const { getByText } = render(
      <Dropdown options={options} value="" onSelect={() => {}} />
    );
    fireEvent.press(getByText('Todos os Dados'));
    expect(getByText('Primeira')).toBeTruthy();
    expect(getByText('Segunda')).toBeTruthy();
  });

  it('chama onSelect ao selecionar uma opção', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <Dropdown options={options} value="" onSelect={onSelect} />
    );
    fireEvent.press(getByText('Todos os Dados'));
    fireEvent.press(getByText('Primeira'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('não abre o dropdown quando está desabilitado', () => {
    const { getByText, queryByText } = render(
      <Dropdown options={options} value="" onSelect={() => {}} disabled />
    );
    fireEvent.press(getByText('Todos os Dados'));
    expect(queryByText('Primeira')).toBeNull();
    expect(queryByText('Segunda')).toBeNull();
  });
}); 