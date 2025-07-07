import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ItensSelectComponent from '../components/ItensSelectionComponent';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: (props: any) => <>{props.name}</>,
}));

describe('ItensSelectComponent', () => {
  const options = [
    { label: 'Ação 1', value: '1' },
    { label: 'Ação 2', value: '2' },
    { label: 'Ação 3', value: '3' },
  ];

  it('renderiza o placeholder quando nada está selecionado', () => {
    const { getByText } = render(
      <ItensSelectComponent options={options} selected={[]} onChange={() => {}} />
    );
    expect(getByText('Selecione...')).toBeTruthy();
  });

  it('renderiza os chips das opções selecionadas', () => {
    const { getByText } = render(
      <ItensSelectComponent options={options} selected={['1', '2']} onChange={() => {}} />
    );
    expect(getByText('Ação 1')).toBeTruthy();
    expect(getByText('Ação 2')).toBeTruthy();
  });

  it('abre o dropdown e mostra as opções disponíveis', () => {
    const { getByText } = render(
      <ItensSelectComponent options={options} selected={['1']} onChange={() => {}} />
    );
    fireEvent.press(getByText('Ação 1'));
    expect(getByText('Ação 2')).toBeTruthy();
    expect(getByText('Ação 3')).toBeTruthy();
  });

  it('chama onChange ao selecionar uma nova opção', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <ItensSelectComponent options={options} selected={[]} onChange={onChange} />
    );
    fireEvent.press(getByText('Selecione...'));
    fireEvent.press(getByText('Ação 1'));
    expect(onChange).toHaveBeenCalledWith(['1']);
  });

  it('chama onChange ao remover uma opção', () => {
    const onChange = jest.fn();
    const { getByText, getByTestId } = render(
      <ItensSelectComponent options={options} selected={['1']} onChange={onChange} />
    );
    fireEvent.press(getByTestId('remove-chip-1'));
    expect(onChange).toHaveBeenCalledWith([]);
  });
}); 