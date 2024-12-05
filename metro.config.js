// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('glb', 'gltf', 'png', 'jpg', 'mp3');

defaultConfig.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

module.exports = defaultConfig;