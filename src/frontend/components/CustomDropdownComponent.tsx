import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownComponentProps {
  label: string;
  options: DropdownOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const CustomDropdownComponent: React.FC<CustomDropdownComponentProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
  placeholder = "Selecione uma opção"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { responsiveSize } = useResponsive();

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  const renderOption = ({ item }: { item: DropdownOption }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item.value === selectedValue && styles.selectedOption
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <Text style={[
        styles.optionText,
        item.value === selectedValue && styles.selectedOptionText,
        { fontSize: responsiveSize(14, 16, 18) }
      ]}>
        {item.label}
      </Text>
      {item.value === selectedValue && (
        <Ionicons name="checkmark" size={responsiveSize(18, 20, 22)} color={Colors.azul} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { fontSize: responsiveSize(14, 16, 18) }]}>
        {label}
      </Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.selectedText,
          !selectedOption && styles.placeholderText,
          { fontSize: responsiveSize(14, 16, 18) }
        ]}>
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={responsiveSize(20, 22, 24)}
          color={Colors.cinzaTexto}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: responsiveSize(16, 18, 20) }]}>
                {label}
              </Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={responsiveSize(20, 22, 24)} color={Colors.cinzaTexto} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    color: Colors.azul,
    fontFamily: Fonts.semiBold,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.branco,
    borderWidth: 1,
    borderColor: Colors.cinzaContraste,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  selectedText: {
    color: Colors.azul,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  placeholderText: {
    color: Colors.cinzaTexto,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.branco,
    borderRadius: 12,
    maxHeight: '70%',
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cinzaContraste,
  },
  modalTitle: {
    color: Colors.azul,
    fontFamily: Fonts.semiBold,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cinzaFundo,
  },
  selectedOption: {
    backgroundColor: Colors.cinzaFundo,
  },
  optionText: {
    color: Colors.azul,
    fontFamily: Fonts.regular,
    flex: 1,
  },
  selectedOptionText: {
    fontFamily: Fonts.medium,
  },
});

export default CustomDropdownComponent;
