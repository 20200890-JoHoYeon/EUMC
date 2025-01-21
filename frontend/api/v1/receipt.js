import axios from '../axios';

const SUB_DIR = '/v1/receipt';

const getTreatmentList = async (hsp_tp_cd, patno, rcptno, meddate, meddept, startDate, endDate) =>
  await axios.post(`${SUB_DIR}/history`, { hsp_tp_cd, patno, rcptno, meddate, meddept, startDate, endDate });

export { getTreatmentList };
