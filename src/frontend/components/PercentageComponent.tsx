import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PercentageComponentProps {
  value?: number;
}

const PercentageComponent: React.FC<PercentageComponentProps> = ({
  value = 0
}) => {
  const getColors = (percentage: number) => {
    if (percentage >= 67) {
      return {
        backgroundColor: '#c8e6c9', 
        textColor: '#2e7d32'       
      };
    } else if (percentage >= 34) {
      return {
        backgroundColor: '#fff9c4', 
        textColor: '#f57f17'       
      };
    } else {
      return {
        backgroundColor: '#ffcdd2', 
        textColor: '#d32f2f'        
      };
    }
  };

  const colors = getColors(value);

  return (
    <View style={styles.container}>
      <View style={[
        styles.percentageBox,
        { backgroundColor: colors.backgroundColor }
      ]}>
        <Text style={[
          styles.percentageText,
          { color: colors.textColor }
        ]}>
          {`${value.toString().padStart(2, '0')}%`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  percentageBox: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PercentageComponent;