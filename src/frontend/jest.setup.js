import '@testing-library/jest-native/extend-expect';

jest.mock('@expo-google-fonts/poppins', () => ({
    useFonts: () => [true, null],
}));

jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native').View;
    return {
        ...jest.requireActual('react-native-gesture-handler'),
        GestureHandlerRootView: View,
    };
}); 