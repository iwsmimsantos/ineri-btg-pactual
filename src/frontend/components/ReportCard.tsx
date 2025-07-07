import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';

interface GeneratedReport {
  id: string;
  title: string;
  clientName: string;
  generatedAt: string;
  content: string;
  htmlContent: string;
  summary: string;
  recommendations: boolean;
}

interface ReportCardProps {
  report: GeneratedReport;
  onOpen: () => void;
  onDownload: () => void;
  onClose: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onOpen, onDownload, onClose }) => {
  const { responsiveSize } = useResponsive();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Strip HTML tags from content for preview
  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .trim();
  };

  const cleanPreview = stripHtml(report.summary);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name="document-text"
            size={responsiveSize(24, 28, 32)}
            color={Colors.azul}
          />
          <View style={styles.headerInfo}>
            <Text style={[styles.title, { fontSize: responsiveSize(16, 18, 20) }]}>
              {report.title}
            </Text>
            <Text style={[styles.subtitle, { fontSize: responsiveSize(12, 14, 16) }]}>
              Gerado em {formatDate(report.generatedAt)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Ionicons
            name="close"
            size={responsiveSize(20, 22, 24)}
            color={Colors.cinzaTexto}
          />
        </TouchableOpacity>
      </View>

      {/* Content Preview */}
      <View style={styles.contentPreview}>
        <Text style={[styles.previewTitle, { fontSize: responsiveSize(14, 16, 18) }]}>
          📋 Prévia do Relatório
        </Text>
        <Text style={[styles.previewText, { fontSize: responsiveSize(12, 14, 16) }]}>
          {cleanPreview}
        </Text>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.verde} />
            <Text style={[styles.featureText, { fontSize: responsiveSize(11, 12, 13) }]}>
              Análise de IA com Gemini
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.verde} />
            <Text style={[styles.featureText, { fontSize: responsiveSize(11, 12, 13) }]}>
              {report.recommendations ? 'Inclui recomendações ML' : 'Análise baseada em dados de portfólio'}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.openButton]}
          onPress={onOpen}
          activeOpacity={0.7}
        >
          <Ionicons
            name="eye"
            size={responsiveSize(18, 20, 22)}
            color={Colors.branco}
          />
          <Text style={[styles.actionButtonText, { fontSize: responsiveSize(14, 16, 18) }]}>
            Visualizar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.downloadButton]}
          onPress={onDownload}
          activeOpacity={0.7}
        >
          <Ionicons
            name="download"
            size={responsiveSize(18, 20, 22)}
            color={Colors.azul}
          />
          <Text style={[styles.actionButtonTextSecondary, { fontSize: responsiveSize(14, 16, 18) }]}>
            Baixar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.branco,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: Colors.preto,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.azul + '20',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cinzaContraste,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
  },
  closeButton: {
    padding: 4,
  },
  contentPreview: {
    padding: 20,
  },
  previewTitle: {
    color: Colors.azul,
    fontFamily: Fonts.semiBold,
    marginBottom: 12,
  },
  previewText: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.regular,
    lineHeight: 22,
    marginBottom: 16,
  },
  features: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    color: Colors.cinzaTexto,
    fontFamily: Fonts.medium,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  openButton: {
    backgroundColor: Colors.azul,
  },
  downloadButton: {
    backgroundColor: Colors.branco,
    borderWidth: 2,
    borderColor: Colors.azul,
  },
  actionButtonText: {
    color: Colors.branco,
    fontFamily: Fonts.semiBold,
  },
  actionButtonTextSecondary: {
    color: Colors.azul,
    fontFamily: Fonts.semiBold,
  },
});

export default ReportCard;
