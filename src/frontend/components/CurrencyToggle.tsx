import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  isPercentage: boolean;
  onToggle: () => void;
};

const CurrencyToggle = ({ isPercentage, onToggle }: Props) => {
    return (
      <Pressable onPress={onToggle} style={styles.toggle} accessibilityRole="button">
        <View style={[styles.switch, isPercentage && styles.switchOn]}>
            <Text style={styles.label}>{isPercentage ? '%' : 'R$'}</Text>
        </View>
      </Pressable>
    );
};

const styles = StyleSheet.create({
  toggle: {
    borderWidth: 2,
    borderColor: '#0071CE',
    borderRadius: 20,
    padding: 2,
  },
  switch: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  switchOn: {
    backgroundColor: '#0071CE',
  },
  label: {
    fontWeight: 'bold',
    color: '#0071CE',
  },

});

export default CurrencyToggle;