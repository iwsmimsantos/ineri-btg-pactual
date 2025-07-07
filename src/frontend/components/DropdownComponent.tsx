import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  mode?: 'escuro' | 'claro';
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onSelect,
  placeholder = 'Todos os Dados',
  mode = 'escuro',
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel =
    options.find(option => option.value === value)?.label || placeholder;

  const getContainerStyle = () => {
    if (disabled) {
      return mode === 'escuro' ? styles.disabledDark : styles.disabledLight;
    }
    return mode === 'escuro' ? styles.darkContainer : styles.lightContainer;
  };

  const getTextStyle = () => {
    if (disabled) {
      return styles.disabledText;
    }
    return mode === 'escuro' ? styles.darkText : styles.lightText;
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setVisible(!visible);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setVisible(false);
  };

  return (
    <View style={{ zIndex: 1000 }}>
      <TouchableOpacity
        style={[styles.container, getContainerStyle()]}
        onPress={toggleDropdown}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={getTextStyle()} numberOfLines={1}>
          {selectedLabel}
        </Text>
        <Ionicons
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={disabled ? '#cccccc' : mode === 'escuro' ? '#222' : '#004d80'}
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {visible && (
        <View style={[styles.dropdown, { marginTop: 4 }]}>
          <FlatList
            data={options}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  darkContainer: {
    backgroundColor: 'white',
    borderColor: '#004d80',
  },
  lightContainer: {
    backgroundColor: 'white',
    borderColor: '#004d80',
  },
  disabledDark: {
    backgroundColor: '#f2f2f2',
    borderColor: '#cccccc',
  },
  disabledLight: {
    backgroundColor: '#f2f2f2',
    borderColor: '#cccccc',
  },
  darkText: {
    color: '#222',
    fontSize: 16,
  },
  lightText: {
    color: '#004d80',
    fontSize: 16,
  },
  disabledText: {
    color: '#cccccc',
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  optionText: {
    fontSize: 16,
    color: '#222',
  },
});

export default Dropdown;
