import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

interface ResponsiveValues {
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  screenWidth: number;
  screenHeight: number;
  isIOS: boolean;
  isAndroid: boolean;
  responsiveSize: (small: number, medium: number, large: number) => number;
  responsiveValue: <T>(small: T, medium: T, large: T) => T;
}

export const useResponsive = (): ResponsiveValues => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;

  // Breakpoints for mobile devices
  const isSmallScreen = width < 350;
  const isMediumScreen = width >= 350 && width < 414;
  const isLargeScreen = width >= 414;

  // Platform detection
  const isIOS = Platform.OS === 'ios';
  const isAndroid = Platform.OS === 'android';

  const responsiveSize = (small: number, medium: number, large: number): number => {
    if (isSmallScreen) return small;
    if (isMediumScreen) return medium;
    return large;
  };

  const responsiveValue = <T>(small: T, medium: T, large: T): T => {
    if (isSmallScreen) return small;
    if (isMediumScreen) return medium;
    return large;
  };

  return {
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    screenWidth: width,
    screenHeight: height,
    isIOS,
    isAndroid,
    responsiveSize,
    responsiveValue,
  };
};
