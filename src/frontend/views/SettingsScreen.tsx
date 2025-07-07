import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';
import SliderComponent from '../components/SliderComponent';
import CustomDropdownComponent from '../components/CustomDropdownComponent';
import ButtonComponent from '../components/ButtonComponent';
import { useSettingsViewModel } from '../viewmodels/SettingsViewModel';
import ErrorComponent from '../components/ErrorComponent';
import LoadingComponent from '../components/LoadingComponent';

export default function SettingsScreen() {
  const { responsiveSize } = useResponsive();
  
  // TODO: Get advisorId from auth context
  const advisorId = 1;

  const {
    preferences,
    loading,
    error,
    loadPreferences,
    updatePreferences,
    clearError
  } = useSettingsViewModel(advisorId);

  // Export settings state
  const [exportSettings, setExportSettings] = React.useState({
    tipoExportacao: 'todos',
    formatoExportacao: 'csv',
  });

  // Import settings state
  const [importSettings, setImportSettings] = React.useState({
    selectedFile: null as DocumentPicker.DocumentPickerResult | null,
  });

  // Button loading states
  const [isExporting, setIsExporting] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);

  // Novo estado local para edição
  const [editPreferences, setEditPreferences] = React.useState(preferences);
  // Estado de loading para o botão Salvar
  const [isSaving, setIsSaving] = React.useState(false);
  // Estado de debounce para o botão Salvar
  const [canSave, setCanSave] = React.useState(true);

  // Sincronizar estado local ao carregar preferences
  React.useEffect(() => {
    setEditPreferences(preferences);
  }, [preferences]);

  React.useEffect(() => {
    setCanSave(false);
    const timeout = setTimeout(() => setCanSave(true), 200);
    return () => clearTimeout(timeout);
  }, [editPreferences]);

  const handleProfileSettingChange = async (key: keyof typeof preferences, value: number) => {
    console.log('Changing preference:', key, 'to value:', value);
    const newPreferences = {
      ...preferences,
      [key]: value,
    };
    
    const success = await updatePreferences(newPreferences);
    
    if (!success) {
      Alert.alert(
        'Erro',
        'Não foi possível salvar suas preferências. Tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  // Dropdown options
  const exportTypeOptions = [
    { label: 'Todos os dados', value: 'todos' },
    { label: 'Dados dos clientes', value: 'clientes' },
    { label: 'Dados de investimentos', value: 'investimentos' },
    { label: 'Relatórios de performance', value: 'performance' },
  ];

  const exportFormatOptions = [
    { label: 'CSV', value: 'csv' },
    { label: 'Excel (XLSX)', value: 'xlsx' },
    { label: 'PDF', value: 'pdf' },
    { label: 'JSON', value: 'json' },
  ];

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      const exportType = exportTypeOptions.find(opt => opt.value === exportSettings.tipoExportacao)?.label;
      const exportFormat = exportFormatOptions.find(opt => opt.value === exportSettings.formatoExportacao)?.label;

      Alert.alert(
        'Exportação Concluída',
        `${exportType} foram exportados em formato ${exportFormat} com sucesso!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Erro na Exportação',
        'Não foi possível exportar os dados. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectCsvFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
      });

      if (result.assets && result.assets.length > 0) {
        setImportSettings(prev => ({
          ...prev,
          selectedFile: result,
        }));
      }
    } catch (err) {
      Alert.alert(
        'Erro',
        'Não foi possível selecionar o arquivo. Tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleImportData = async () => {
    if (!importSettings.selectedFile) {
      Alert.alert(
        'Aviso',
        'Por favor, selecione um arquivo CSV para importar.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsImporting(true);
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert(
        'Importação Concluída',
        'Os dados foram importados com sucesso!',
        [{ text: 'OK' }]
      );
      setImportSettings(prev => ({
        ...prev,
        selectedFile: null,
      }));
    } catch (error) {
      Alert.alert(
        'Erro na Importação',
        'Não foi possível importar os dados. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsImporting(false);
    }
  };

  // Função para salvar preferências
  const handleSavePreferences = async () => {
    setIsSaving(true);
    console.log('Salvando preferências:', editPreferences);
    const success = await updatePreferences(editPreferences);
    setIsSaving(false);
    if (success) {
      await loadPreferences(); // Garante sincronização
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingComponent message="Carregando configurações..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorComponent 
          message={error}
          onRetry={loadPreferences}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: responsiveSize(24, 28, 32) }]}>
          Ajustes
        </Text>
      </View>

      {/* Profile Definition Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: responsiveSize(18, 20, 22) }]}>
          Definição do Perfil de Atendimento
        </Text>
        <Text style={[styles.sectionSubtitle, { fontSize: responsiveSize(14, 16, 18) }]}>
          Quanto você se interessa por atender clientes com...
        </Text>

        <View style={styles.slidersContainer}>
          <SliderComponent
            label="Maior volume investido"
            value={editPreferences.preferenciaVolumeInvestido}
            onValueChange={value => setEditPreferences(prev => ({ ...prev, preferenciaVolumeInvestido: value }))}
            min={0}
            max={100}
            step={10}
          />

          <SliderComponent
            label="Maior nível de desenquadramento"
            value={editPreferences.preferenciaNivelDesenquadramento}
            onValueChange={value => setEditPreferences(prev => ({ ...prev, preferenciaNivelDesenquadramento: value }))}
            min={0}
            max={100}
            step={10}
          />

          <SliderComponent
            label="Longo tempo sem contato"
            value={editPreferences.preferenciaTempoSemContato}
            onValueChange={value => setEditPreferences(prev => ({ ...prev, preferenciaTempoSemContato: value }))}
            min={0}
            max={100}
            step={10}
          />
        </View>
        <ButtonComponent
          title="Salvar"
          mode="escuro"
          size="large"
          fullWidth
          onPress={handleSavePreferences}
          loading={isSaving}
          disabled={isSaving || !canSave}
        />
      </View>

      {/* CSV Import Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: responsiveSize(18, 20, 22) }]}>
          Importação de Dados CSV
        </Text>
        <Text style={[styles.sectionSubtitle, { fontSize: responsiveSize(14, 16, 18) }]}>
          Importe dados de clientes e investimentos através de arquivos CSV
        </Text>

        <View style={styles.importContainer}>
          <View style={styles.fileSelectionContainer}>
            <Text style={[styles.fileLabel, { fontSize: responsiveSize(14, 16, 18) }]}>
              Arquivo CSV
            </Text>

            <TouchableOpacity
              style={styles.fileSelectButton}
              onPress={handleSelectCsvFile}
              activeOpacity={0.7}
            >
              <Ionicons name="document-outline" size={20} color={Colors.azul} />
              <Text style={[styles.fileSelectText, { fontSize: responsiveSize(14, 16, 18) }]}>
                {importSettings.selectedFile?.assets?.[0]?.name || 'Selecionar arquivo CSV'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.cinzaTexto} />
            </TouchableOpacity>

            {importSettings.selectedFile?.assets?.[0] && (
              <View style={styles.fileInfoContainer}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.verde} />
                <Text style={[styles.fileInfoText, { fontSize: responsiveSize(12, 14, 16) }]}>
                  Arquivo selecionado: {importSettings.selectedFile.assets[0].name}
                </Text>
              </View>
            )}

            <ButtonComponent
              title="Importar dados"
              mode="escuro"
              size="medium"
              fullWidth
              loading={isImporting}
              onPress={handleImportData}
            />
          </View>
        </View>
      </View>

      {/* Data Export Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: responsiveSize(18, 20, 22) }]}>
          Exportação de Dados
        </Text>
        <Text style={[styles.sectionSubtitle, { fontSize: responsiveSize(14, 16, 18) }]}>
          Exporte seus dados em diferentes formatos
        </Text>

        <View style={styles.exportContainer}>
          <CustomDropdownComponent
            label="Tipo de dados"
            selectedValue={exportSettings.tipoExportacao}
            options={exportTypeOptions}
            onValueChange={(value) => setExportSettings(prev => ({ ...prev, tipoExportacao: value }))}
          />

          <CustomDropdownComponent
            label="Formato de exportação"
            selectedValue={exportSettings.formatoExportacao}
            options={exportFormatOptions}
            onValueChange={(value) => setExportSettings(prev => ({ ...prev, formatoExportacao: value }))}
          />

          <ButtonComponent
            title="Exportar dados"
            mode="escuro"
            size="medium"
            fullWidth
            loading={isExporting}
            onPress={handleExportData}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cinzaFundo,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  section: {
    backgroundColor: Colors.branco,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.preto,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
    marginBottom: 20,
    lineHeight: 22,
  },
  slidersContainer: {
    marginBottom: 24,
  },
  exportContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 8,
  },
  importContainer: {
    marginBottom: 24,
  },
  fileSelectionContainer: {
    marginTop: 8,
  },
  fileLabel: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
    marginBottom: 8,
  },
  fileSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.cinzaContraste,
    borderRadius: 8,
    backgroundColor: Colors.branco,
    minHeight: 48,
  },
  fileSelectText: {
    flex: 1,
    marginLeft: 8,
    color: Colors.azul,
    fontFamily: Fonts.regular,
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: Colors.verde + '15',
    borderRadius: 6,
  },
  fileInfoText: {
    marginLeft: 8,
    color: Colors.verde,
    fontFamily: Fonts.medium,
    flex: 1,
  },
});
