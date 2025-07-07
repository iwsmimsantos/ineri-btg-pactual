import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CurrencyToggle from '../components/CurrencyToggle';

describe('CurrencyToggle', () => {
  it('renderiza com símbolo de porcentagem quando isPercentage=true', () => {
    const { getByText } = render(
      <CurrencyToggle isPercentage={true} onToggle={() => {}} />
    );
    expect(getByText('%')).toBeTruthy();
  });

  it('renderiza com símbolo de real quando isPercentage=false', () => {
    const { getByText } = render(
      <CurrencyToggle isPercentage={false} onToggle={() => {}} />
    );
    expect(getByText('R$')).toBeTruthy();
  });

  it('chama onToggle ao pressionar', () => {
    const onToggleMock = jest.fn();
    const { getByRole } = render(
      <CurrencyToggle isPercentage={false} onToggle={onToggleMock} />
    );
    fireEvent.press(getByRole('button'));
    expect(onToggleMock).toHaveBeenCalled();
  });
}); 