import axios from '../axios';

const SUB_DIR = '/v1/prescription';

const getPrescriptionnHistory = async (his_hsp_tp_cd, pt_no, ord_dt, ams_no, pact_id) =>
  await axios.get(`${SUB_DIR}/detail-info`, { params: { his_hsp_tp_cd, pt_no, ord_dt, ams_no, pact_id } });

export { getPrescriptionnHistory };
