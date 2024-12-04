import { Canvas } from '@react-three/fiber';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls, Html } from '@react-three/drei';
import { Asset } from 'expo-asset';
import { Object3D, MeshPhysicalMaterial } from 'three';
import { StarField } from '../components/StarField';  // StarField 컴포넌트 import
import { Audio } from 'expo-av';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 모델 import 객체 생성
const zodiacModels = {
  Aries: require('../assets/models/Aries.glb'),
  Taurus: require('../assets/models/Taurus.glb'),
  Gemini: require('../assets/models/Gemini.glb'),
  Cancer: require('../assets/models/Cancer.glb'),
  Leo: require('../assets/models/Leo.glb'),
  Virgo: require('../assets/models/Virgo.glb'),
  Libra: require('../assets/models/Libra.glb'),
  Scorpius: require('../assets/models/Scorpius.glb'),
  Sagittarius: require('../assets/models/Sagittarius.glb'),
  Capricornus: require('../assets/models/Capricornus.glb'),
  Aquarius: require('../assets/models/Aquarius.glb'),
  Pisces: require('../assets/models/Pisces.glb')
} as const;

// 별자리 날짜 정보 정의
const zodiacDates = {
  Aries: '3/21 ~ 4/19',
  Taurus: '4/20 ~ 5/20',
  Gemini: '5/21 ~ 6/21',
  Cancer: '6/22 ~ 7/22',
  Leo: '7/23 ~ 8/22',
  Virgo: '8/23 ~ 9/22',
  Libra: '9/23 ~ 10/23',
  Scorpius: '10/24 ~ 11/21',
  Sagittarius: '11/22 ~ 12/21',
  Capricornus: '12/22 ~ 1/19',
  Aquarius: '1/20 ~ 2/18',
  Pisces: '2/19 ~ 3/20'
} as const;

// 2D 텍스트 박스 컴포넌트
const TextBox = ({ position, text }: { position: [number, number, number]; text: string }) => {
  return (
    <Html position={position} style={{ pointerEvents: 'none' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        width: '200px',
        textAlign: 'center',
        transform: 'translate(-50%, -50%)'
      }}>
        {text}
      </div>
    </Html>
  );
};

// 별자리 모델 생성을 위한 공통 컴포넌트
function ZodiacModel({ name, angle, position = [0, 0, 0] }: { name: keyof typeof zodiacModels; angle: number; position?: number[] }) {
  const [modelUri, setModelUri] = useState<string | null>(null);
  const modelRef = useRef<Object3D>();
  const ROTATION_SPEED = 0.6; // 로테이션 속도
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scale = useRef(1);

  useFrame((state, delta) => {
    if (!modelRef.current) return;
    
    // 호버링 시 scale 애니메이션
    if (isHovered) {
      scale.current = THREE.MathUtils.lerp(scale.current, 1.1, 0.1);
    } else {
      scale.current = THREE.MathUtils.lerp(scale.current, 1, 0.1);
    }
    
    modelRef.current.scale.setScalar(scale.current);
  });

  useEffect(() => {
    async function loadModel() {
      try {
        const asset = Asset.fromModule(zodiacModels[name]);
        await asset.downloadAsync();
        setModelUri(asset.localUri || asset.uri);
      } catch (error) {
        console.error(`${name} model error:`, error);
      }
    }
    loadModel();
  }, [name]);

  const gltf = modelUri ? useLoader(GLTFLoader, modelUri) : null;

  useEffect(() => {
    if (gltf) {
      const glassMaterial = new MeshPhysicalMaterial({
        roughness: 0.5,
        transmission: 0.9,
        thickness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        ior: 1.5,
        envMapIntensity: 1.4,
        metalness: 0.4,
        transparent: true,
        opacity: 0.65,
        color: '#CECEF6',
        emissive: '#ECE0F8',
        emissiveIntensity: 0.1,
        attenuationColor: '#193d7c',
        attenuationDistance: 0.3,
      });

      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.material = glassMaterial;
          // Mesh를 클릭 가능하게 설정
          child.userData = { clickable: true };
        }
      });

      const radius = 8; // 원형 배치 반경
      const radian = (angle * Math.PI) / 180; // 각도를 라디안으로 변환
      
      // position prop 적용
      gltf.scene.position.x = (radius * Math.cos(radian)) + position[0];
      gltf.scene.position.y = position[1];  // y position 직접 적용
      gltf.scene.position.z = (radius * Math.sin(radian)) + position[2];
      
      // 중심을 바라보도록 y축 회전
      const rotationAngle = Math.atan2(
        gltf.scene.position.x,
        gltf.scene.position.z
      );
      gltf.scene.rotation.y = rotationAngle;
    }
  }, [gltf, angle, position]);

  useFrame((state) => {
    if (modelRef.current) {
      // y 위치를 position prop 기준으로 조정
      const baseY = position[1];  // 기본 y 위치
      modelRef.current.position.y = baseY + (Math.sin(state.clock.elapsedTime) * 0.16);
      
      // 모델 회전
      const radian = (angle * Math.PI) / 180;
      modelRef.current.rotation.y = radian + Math.PI + (state.clock.elapsedTime * ROTATION_SPEED);
    }
  });

  interface ClickEvent extends React.MouseEvent {
    object: {
      userData?: {
        clickable?: boolean;
      };
    };
  }

  const handleClick = (event: ClickEvent) => {
    event.stopPropagation();
    if (event.object.userData?.clickable) {
      setIsClicked(!isClicked);
    }
  };

  if (!gltf) return null;

  const radius = 8; // 원형 배치 반경
  const radian = (angle * Math.PI) / 180; // 각도를 라디안으로 변환

  return (
    <group>
      <primitive 
        ref={modelRef} 
        object={gltf.scene} 
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      />
      <Html
        position={[
          (radius * Math.cos(radian)) + position[0],
          1.2,
          (radius * Math.sin(radian)) + position[2]
        ]}
        center
        style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '1em',
          userSelect: 'none',
          whiteSpace: 'nowrap', // 줄바꿈 방지
          textShadow: '0 0 10px rgba(0,0,0,0.5)'
        }}
      >
        <div>
          <div>{name}</div>
          <div style={{ 
            fontSize: '0.8em',
            marginTop: '0.2em',
            minWidth: '120px' // 텍스트 영역 최소 너비 설정
          }}>
            {zodiacDates[name].replace('~', ' ~ ')} {/* ~ 앞뒤로 공백 추가 */}
          </div>
        </div>
      </Html>
      {isClicked && (
        <>
          <TextBox 
            position={[
              gltf.scene.position.x,
              // Capricornus일 때는 더 높은 위치에 텍스트박스 배치
              gltf.scene.position.y + (name === 'Capricornus' ? -0.5 : -1.5),
              gltf.scene.position.z
            ]}
            text="Text Box"
          />
        </>
      )}
    </group>
  );
}

// 모든 별자리 모델을 렌더링하는 컴포넌트
function ZodiacModels() {
  const zodiacSigns = Object.keys(zodiacModels) as Array<keyof typeof zodiacModels>;

  return (
    <>
      {zodiacSigns.map((sign, index) => (
        <ZodiacModel
          key={sign}
          name={sign}
          angle={index * 30}
          position={sign === 'Capricornus' ? [0, -1, 0] : [0, 0, 0]} // Capricornus만 y축으로 -1만큼 이동
        />
      ))}
    </>
  );
}

function AudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);

  async function loadSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/music/space.mp3'),
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
  button: {
    position: 'absolute',
    top: 40, // 상단에서 더 멀리
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경색 더 진하게
    borderRadius: 25, // 더 둥글게
    width: 50, // 더 크게
    height: 50, // 더 크게
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1000, // 최상단에 표시
    elevation: 5, // Android에서 그림자 효과
  }
});

export default function App() {
  return (
    <>
      <AudioPlayer />
      <Canvas
        shadows
        camera={{ 
          position: [0, 1, 0], // 중앙에 위치
          fov: 31 // 시야각
        }}
        style={{ width: '100%', height: '100%', background: '#000514' }}
        onCreated={({ gl }) => {
          gl.domElement.style.touchAction = 'none';
        }}
      >
        <StarField />
        <ambientLight intensity={6.6} color="#ffffff" />
        <directionalLight position={[3, 8, 4]} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
        <ZodiacModels />
      </Canvas>
    </>
  );
}