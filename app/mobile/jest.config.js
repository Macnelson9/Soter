module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    '/node_modules/(?!.*node_modules/)(?!' +
    '(jest-)?react-native|' +
    '@react-native(-community)?/|' +
    'expo|' +
    'expo-modules-core|' +
    '@expo/|' +
    '@expo-google-fonts/|' +
    'react-navigation|' +
    '@react-navigation/|' +
    '@unimodules/|' +
    'unimodules|' +
    'sentry-expo|' +
    'native-base|' +
    'react-native-svg' +
    ')',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
