import axios from '../axios';

const SUB_DIR = '/v1/med-dept';

const getDeptWaitingList = async (his_hsp_tp_cd, pt_no, rpy_pact_id) =>
  await axios.get(`${SUB_DIR}/waitingList`, { params: { his_hsp_tp_cd, pt_no, rpy_pact_id } });

export {
  getDeptWaitingList,
};
