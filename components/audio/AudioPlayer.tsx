import React, { useEffect, useState } from 'react'; // StarField 컴포넌트 import
import { Audio } from 'expo-av';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AudioPlayer() {
    const [sound, setSound] = useState<Audio.Sound>();
    const [isPlaying, setIsPlaying] = useState(false);
  
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/music/space.mp3'),
        { isLooping: true }
      );
      setSound(sound);
    }
  
    useEffect(() => {
      loadSound();
      return () => {
        sound?.unloadAsync();
      };
    }, []);
  
    const togglePlay = async () => {
      if (!sound) return;
      
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    };
  
    return (
      <TouchableOpacity 
        onPress={togglePlay}
        style={styles.button}
      >
        <Ionicons 
          name={isPlaying ? "pause" : "play"} // 아이콘 변경
          size={32} // 크기 증가
          color="white" 
        />
      </TouchableOpacity>
    );
  }


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