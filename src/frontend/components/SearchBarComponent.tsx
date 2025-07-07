import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';

interface SearchBarComponentProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: (text: string) => void;
}

const SearchBarComponent: React.FC<SearchBarComponentProps> = ({
  placeholder = "Buscar...",
  value,
  onChangeText,
  onSearch,
}) => {
  const { responsiveSize } = useResponsive();

  const handleSubmitEditing = () => {
    onSearch?.(value);
  };

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={responsiveSize(18, 20, 22)} color={Colors.cinzaTexto} />
      <TextInput
        style={[styles.searchInput, { fontSize: responsiveSize(14, 16, 18) }]}
        placeholder={placeholder}
        placeholderTextColor={Colors.cinzaTexto}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmitEditing}
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCapitalize="words"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cinzaContraste,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  searchInput: {
    marginLeft: 12,
    color: Colors.preto,
    fontFamily: Fonts.regular,
    flex: 1,
    height: '100%',
  },
});

export default SearchBarComponent;
