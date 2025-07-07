import React from 'react';
import { render } from '@testing-library/react-native';
import PercentageComponent from '../components/PercentageComponent';

describe('PercentageComponent', () => {
  it('renderiza o valor formatado com zero à esquerda', () => {
    const { getByText } = render(<PercentageComponent value={5} />);
    expect(getByText('05%')).toBeTruthy();
  });

  it('renderiza o valor padrão 0% se não for passado', () => {
    const { getByText } = render(<PercentageComponent />);
    expect(getByText('00%')).toBeTruthy();
  });

  it('aplica cor de fundo e texto para >= 67%', () => {
    const { getByText } = render(<PercentageComponent value={80} />);
    const text = getByText('80%');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#2e7d32' })
      ])
    );
  });

  it('aplica cor de fundo e texto para >= 34% e < 67%', () => {
    const { getByText } = render(<PercentageComponent value={50} />);
    const text = getByText('50%');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#f57f17' })
      ])
    );
  });

  it('aplica cor de fundo e texto para < 34%', () => {
    const { getByText } = render(<PercentageComponent value={10} />);
    const text = getByText('10%');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#d32f2f' })
      ])
    );
  });
}); 