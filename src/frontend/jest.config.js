module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['./jest.setup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo|@expo|@unimodules|unimodules|sentry-expo|native-base)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '\\.(svg)$': '<rootDir>/__mocks__/svgMock.js',
        'react-native/Libraries/Animated/src/NativeAnimatedHelper': '<rootDir>/__mocks__/nativeAnimatedHelperMock.js',
        'react-native-reanimated': '<rootDir>/__mocks__/reanimatedMock.js'
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    collectCoverageFrom: [
        'components/**/*.{js,jsx,ts,tsx}'
    ],
    coverageReporters: ['text'],
}; 