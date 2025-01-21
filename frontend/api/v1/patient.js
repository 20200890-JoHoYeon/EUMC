import axios from '../axios';

const SUB_DIR = '/v1/patient';

const getPatientInfo = async (nm, birth, pt_no) => await axios.post(`${SUB_DIR}/chk-info`, { nm, birth, pt_no });

export { getPatientInfo };
