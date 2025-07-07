import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBarComponent from '../components/SearchBarComponent';

describe('SearchBarComponent', () => {
  it('renderiza o input', () => {
    const { getByPlaceholderText } = render(<SearchBarComponent />);
    expect(getByPlaceholderText('')).toBeTruthy();
  });

  it('chama onSearch ao digitar', () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(<SearchBarComponent onSearch={onSearch} />);
    fireEvent.changeText(getByPlaceholderText(''), 'abc');
    expect(onSearch).toHaveBeenCalledWith('abc');
  });

  it('mostra botão de limpar ao digitar e chama onClear ao clicar', () => {
    const onClear = jest.fn();
    const { getByPlaceholderText, getByRole } = render(<SearchBarComponent onClear={onClear} />);
    const input = getByPlaceholderText('');
    fireEvent.changeText(input, 'abc');
    // O botão de limpar é o único TouchableOpacity extra
    const clearButton = getByRole('button');
    fireEvent.press(clearButton);
    expect(onClear).toHaveBeenCalled();
    expect(input.props.value).toBe('');
  });
}); 