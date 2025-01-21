import { Platform } from 'react-native';
import axios from '../axios';

const SUB_DIR = '/v1/app';

const storePush = async (patno, pushKey) =>
  await axios.post(`${SUB_DIR}/push`, { patno, pushKey, osType: Platform.OS });

export { storePush };
