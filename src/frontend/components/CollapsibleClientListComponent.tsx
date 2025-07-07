import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import ClientCardComponent from './ClientCardComponent';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Client {
  id: string;
  name: string;
  profileType: string;
  portfolioType: string;
  percentage: number;
  initials?: string;
}

interface CollapsibleClientListComponentProps {
  title: string;
  subtitle: string;
  clients: Client[];
  icon?: string;
  onClientPress?: (clientId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const CollapsibleClientListComponent: React.FC<CollapsibleClientListComponentProps> = ({
  title,
  subtitle,
  clients,
  icon,
  onClientPress,
  onLoadMore,
  hasMore
}) => {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    // Configure layout animation for content
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Animate arrow rotation
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setExpanded(!expanded);
  };

  const arrowRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header section */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.leftHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>
              $
            </Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.rightHeader}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{clients.length.toString().padStart(2, '0')}</Text>
          </View>
          <Animated.View
            style={[
              styles.arrowContainer,
              { transform: [{ rotate: arrowRotation }] }
            ]}
          >
            <Text style={styles.arrowText}>▼</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Expandable content */}
      {expanded && (
        <View style={styles.content}>
          {clients.map((client) => (
            <ClientCardComponent
              key={client.id}
              clientName={client.name}
              profileType={client.profileType}
              portfolioType={client.portfolioType}
              percentage={client.percentage}
              initials={client.initials}
              onPress={() => onClientPress?.(client.id)}
            />
          ))}
          {hasMore && (
            <TouchableOpacity style={{padding: 12, alignItems: 'center'}} onPress={onLoadMore}>
              <Text style={{color: '#004d80', fontWeight: 'bold'}}>Ver mais</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e8f0f5', // Light blue background
    padding: 16,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#004d80', // Dark blue
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  arrowContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 14,
    color: '#004d80',
  },
  content: {
    padding: 0,
  },
});

export default CollapsibleClientListComponent;
