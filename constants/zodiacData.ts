// 모델 import 객체 생성
export const Models = {
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
export const Dates = {
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