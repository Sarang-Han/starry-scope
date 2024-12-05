import React, { Suspense } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { StarField } from './components/starfield/StarField';  // StarField 컴포넌트 import
import ZodiacModels from './components/zodiac/ZodiacModels';  // ZodiacModels 컴포넌트 import
import AudioPlayer from './components/audio/AudioPlayer';  // Import AudioPlayer component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000514',
  },
  button: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1000,
  },
  textBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: 200,
    alignItems: 'center',
  },
  textBoxContent: {
    textAlign: 'center',
  },
  zodiacLabel: {
    alignItems: 'center',
  },
  zodiacName: {
    color: 'white',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  zodiacDate: {
    color: 'white',
    fontSize: 13,
    marginTop: 2,
    minWidth: 120,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <AudioPlayer />
      <Canvas
        style={{ flex: 1 }}
        camera={{ 
          position: [0, 1, 0],
          fov: 31
        }}
      >
        <Suspense fallback={null}>
          <StarField />
          <ambientLight intensity={6.6} />
          <directionalLight position={[3, 8, 4]} />
          <ZodiacModels />
        </Suspense>
      </Canvas>
    </View>
  );
}