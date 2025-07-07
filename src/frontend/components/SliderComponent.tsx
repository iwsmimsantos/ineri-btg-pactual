import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useResponsive } from '../hooks/useResponsive';

interface SliderComponentProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const SliderComponent: React.FC<SliderComponentProps> = ({
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 10,
}) => {
  const { responsiveSize } = useResponsive();

  const trackRef = useRef<View>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (trackRef.current) {
          trackRef.current.measure((fx, fy, width, height, px, py) => {
            const x = evt.nativeEvent.pageX - px;
            let percent = x / width;
            percent = Math.max(0, Math.min(1, percent));
            let newValue = min + percent * (max - min);
            newValue = Math.round(newValue / step) * step;
            newValue = Math.max(min, Math.min(max, newValue));
            if (newValue !== value) {
              onValueChange(newValue);
            }
          });
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onValueChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onValueChange(newValue);
  };

  const progressPercentage = ((value - min) / (max - min)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { fontSize: responsiveSize(14, 16, 18) }]}>
          {label}
        </Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { fontSize: responsiveSize(16, 18, 20) }]}>
            {value}%
          </Text>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleDecrease}
          disabled={value <= min}
        >
          <Text style={[styles.controlText, value <= min && styles.disabledText]}>-</Text>
        </TouchableOpacity>

        <View style={styles.trackContainer}>
          <View
            style={styles.track}
            ref={trackRef}
            {...panResponder.panHandlers}
          >
            <View style={[styles.progress, { width: `${progressPercentage}%` }]} />
            <View style={[styles.thumb, { left: `${progressPercentage}%` }]} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleIncrease}
          disabled={value >= max}
        >
          <Text style={[styles.controlText, value >= max && styles.disabledText]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: Colors.azul,
    fontFamily: Fonts.medium,
    flex: 1,
  },
  valueContainer: {
    backgroundColor: Colors.cinzaContraste,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  value: {
    color: Colors.azul,
    fontFamily: Fonts.bold,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.azul,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  controlText: {
    color: Colors.branco,
    fontSize: 18,
    fontFamily: Fonts.bold,
  },
  disabledText: {
    color: Colors.cinzaTexto,
  },
  trackContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 8,
    backgroundColor: Colors.cinzaContraste,
    borderRadius: 4,
    position: 'relative',
  },
  progress: {
    height: 8,
    backgroundColor: Colors.azul,
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: Colors.azul,
    borderRadius: 10,
    position: 'absolute',
    top: -6,
    marginLeft: -10,
    shadowColor: Colors.preto,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default SliderComponent;
