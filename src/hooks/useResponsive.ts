import { useWindowDimensions, Platform } from 'react-native';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isSmallPhone: boolean; // < 375px
  isPhone: boolean;      // < 768px
  isTablet: boolean;     // 768px - 1023px
  isDesktop: boolean;    // >= 1024px
  isLandscape: boolean;
  contentMaxWidth: number;  
  horizontalPadding: number;
  isWeb: boolean;
}

export const useResponsive = (): ResponsiveInfo => {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = width < 375;
  const isPhone = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isLandscape = width > height;

  const contentMaxWidth = isDesktop ? 1040 : isTablet ? 740 : 540;
  const horizontalPadding = isDesktop ? 32 : isTablet ? 24 : isSmallPhone ? 12 : 16;

  return {
    width,
    height,
    isSmallPhone,
    isPhone,
    isTablet,
    isDesktop,
    isLandscape,
    contentMaxWidth,
    horizontalPadding,
    isWeb: Platform.OS === 'web',
  };
};
