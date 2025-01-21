import axios from '../axios';

const SUB_DIR = '/v1/payment';

const getPaymentList = async (his_hsp_tp_cd, pt_no, from_dt, to_dt) =>
  await axios.get(`${SUB_DIR}/history`, { params: { his_hsp_tp_cd, pt_no, from_dt, to_dt } });

const getPaymentListDtl = async (his_hsp_tp_cd, pt_no, from_dt, to_dt) =>
  await axios.get(`${SUB_DIR}/historyDtl`, { params: { his_hsp_tp_cd, pt_no, from_dt, to_dt } });


const checkPaymentList = async (his_hsp_tp_cd, pat_no) =>
  await axios.post(`${SUB_DIR}/checkPaymentList`, { his_hsp_tp_cd, pat_no } );

export { getPaymentList, checkPaymentList, getPaymentListDtl };

