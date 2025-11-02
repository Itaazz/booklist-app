import { Platform } from 'react-native';

export const LOCAL_IP = 'localhost';

export const BASE =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : `http://${LOCAL_IP}:3000`;

