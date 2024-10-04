module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts|@unimodules|expo(nent)?/.*|@react-native|react-native-web|@react-native-web|@react-navigation/.*)',
  ],
};
