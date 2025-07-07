import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ItensSelectComponent: React.FC<MultiSelectDropdownProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Selecione...',
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (value: string) => {
    if (!selected.includes(value)) {
      onChange([...selected, value]);
    }
    setVisible(false);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter(item => item !== value));
  };

  const selectedOptions = options.filter(opt => selected.includes(opt.value));
  const availableOptions = options.filter(opt => !selected.includes(opt.value));

  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Ações</Text>
        <Text style={styles.labelPercent}>(%)</Text>
      </View>
      <TouchableOpacity
        style={[styles.container, disabled && styles.disabledContainer]}
        onPress={() => !disabled && setVisible((v) => !v)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <View style={styles.chipsRow}>
          {selectedOptions.length === 0 && (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
          {selectedOptions.map(opt => (
            <View key={opt.value} style={styles.chip}>
              <Text style={styles.chipText}>{opt.label}</Text>
              <TouchableOpacity
                style={styles.chipClose}
                onPress={() => handleRemove(opt.value)}
                disabled={disabled}
                testID={`remove-chip-${opt.value}`}
              >
                <Ionicons name="close" size={18} color="#444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Ionicons
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#222"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdown}>
          <FlatList
            data={availableOptions}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma opção disponível</Text>
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    marginLeft: 2,
  },
  label: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  labelPercent: {
    color: '#bbb',
    fontSize: 16,
    marginLeft: 4,
  },
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    minWidth: 200,
    justifyContent: 'space-between',
  },
  disabledContainer: {
    backgroundColor: '#f3f3f3',
    borderColor: '#e0e0e0',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
  },
  chip: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 15,
    color: '#444',
    marginRight: 6,
  },
  chipClose: {
    padding: 2,
  },
  placeholder: {
    color: '#bbb',
    fontSize: 15,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 220,
    maxHeight: 220,
    borderWidth: 1,
    borderColor: '#bbb',
    marginTop: 4,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    paddingVertical: 8,
    zIndex: 10,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  optionText: {
    fontSize: 16,
    color: '#222',
  },
  emptyText: {
    color: '#bbb',
    fontSize: 16,
    padding: 18,
    textAlign: 'center',
  },
});

export default ItensSelectComponent;
