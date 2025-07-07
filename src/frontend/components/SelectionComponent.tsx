import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Dropdown from './DropdownComponent'; // ajuste o caminho se necessário

const options = [
  { label: 'Opção 1', value: 'op1' },
  { label: 'Opção 2', value: 'op2' },
  { label: 'Opção 3', value: 'op3' },
];

const SelectionComponent = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleSelect = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione uma opção:</Text>
      <View style={styles.dropdownWrapper}>
        <Dropdown
          options={options}
          value={selectedValue}
          onSelect={handleSelect}
          placeholder="Todos os Dados"
          mode="escuro"
        />
      </View>
      {selectedValue ? (
        <Text style={styles.selectedText}>Selecionado: {selectedValue}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 350,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',  // centraliza conteúdo horizontalmente
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
    color: '#004d80',
    fontWeight: '600',
    alignSelf: 'flex-start',  // título alinhado à esquerda
  },
  dropdownWrapper: {
    width: '100%',  // faz o dropdown ocupar toda largura do container
  },
  selectedText: {
    marginTop: 16,
    fontSize: 14,
    color: '#222',
    alignSelf: 'flex-start', // texto alinhado à esquerda
  },
});

export default SelectionComponent;
