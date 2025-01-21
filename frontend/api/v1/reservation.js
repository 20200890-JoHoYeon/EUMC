import axios from '../axios';

const SUB_DIR = '/v1/reservation';


const getTodaySchedule = async (his_hsp_tp_cd, pt_no) =>
  await axios.get(`${SUB_DIR}/getTodaySchedule2`, { params: { his_hsp_tp_cd, pt_no } });

const getTodayScheduleInner = async (his_hsp_tp_cd, pt_no, hmpg_cust_no) =>
  await axios.get(`${SUB_DIR}/getTodaySchedule`, { params: { his_hsp_tp_cd, pt_no, hmpg_cust_no } });


const getRsvDeptList = async his_hsp_tp_cd =>
  await axios.get(`${SUB_DIR}/rsvMeddeptList`, { params: { his_hsp_tp_cd } });

const getMedicalHistory = async (his_hsp_tp_cd, pt_no, hmpg_cust_no, from_dt, to_dt) =>
  await axios.get(`${SUB_DIR}/medicalHistory`, { params: { his_hsp_tp_cd, pt_no, hmpg_cust_no, from_dt, to_dt } });

const getExamHistory = async (his_hsp_tp_cd, pt_no, hmpg_cust_no, from_dt, to_dt) =>
  await axios.get(`${SUB_DIR}/examHistory`, { params: { his_hsp_tp_cd, pt_no, hmpg_cust_no, from_dt, to_dt } });


const getDrugHistory = async (his_hsp_tp_cd, pt_no, hmpg_cust_no, from_dt, to_dt) =>
  await axios.get(`${SUB_DIR}/drugHistory`, { params: { his_hsp_tp_cd, pt_no, hmpg_cust_no, from_dt, to_dt } });




const getExamRsvList = async (pt_no, his_hsp_tp_cd) =>
  await axios.get(`${SUB_DIR}/examRsvList`, { params: { pt_no, his_hsp_tp_cd} });

const getDocList = async (his_hsp_tp_cd, dept_cd) =>
  await axios.get(`${SUB_DIR}/medDocList`, { params: { his_hsp_tp_cd, dept_cd } });

const getScheduleDateList = async (his_hsp_tp_cd, dept_cd, dr_sid, med_ym) =>
  await axios.get(`${SUB_DIR}/medSchdList`, { params: { his_hsp_tp_cd, dept_cd, dr_sid, med_ym } });

const getDoctorScheduleList = async (his_hsp_tp_cd, dept_cd, med_dt, dr_sid) =>
  await axios.get(`${SUB_DIR}/medDtmList`, { params: { his_hsp_tp_cd, dept_cd, med_dt, dr_sid } });

const requestRsvInfom = async (his_hsp_tp_cd, patno, rsv_patno, hmpg_cust_no, dept_cd, dr_sid, med_dt, med_tm) =>
  await axios.post(`${SUB_DIR}/requestRsvInfom`, {
    his_hsp_tp_cd,
    patno,
    rsv_patno,
    hmpg_cust_no,
    dept_cd,
    dr_sid,
    med_dt,
    med_tm,
  });

const getRsvListInner = async (his_hsp_tp_cd, pt_no, hmpg_cust_no) =>
  await axios.get(`${SUB_DIR}/getRsvList`, { params: { his_hsp_tp_cd, pt_no, hmpg_cust_no } });


const getRsvList = async (his_hsp_tp_cd, pt_no, hmpg_cust_no, from_dt, to_dt) =>
  await axios.get(`${SUB_DIR}/getRsvList2`, { params: { his_hsp_tp_cd, pt_no, hmpg_cust_no, from_dt, to_dt } });

const deleteReservation = async (his_hsp_tp_cd, pt_no, rpy_pact_id, hmpg_cust_no, dept_cd) =>
  await axios.delete(`${SUB_DIR}/deleteRsv`, { data: { his_hsp_tp_cd, pt_no, rpy_pact_id, hmpg_cust_no, dept_cd } });

const requestArrive = async (his_hsp_tp_cd, pact_id) =>
  await axios.post(`${SUB_DIR}/requestArrive`, {
    his_hsp_tp_cd,
    pact_id
  });


export {
  getRsvDeptList,
  getMedicalHistory,
  getExamHistory,
  getDrugHistory,
  getExamRsvList,
  getDocList,
  getScheduleDateList,
  getDoctorScheduleList,
  requestRsvInfom,
  getRsvList,
  getRsvListInner,
  getTodayScheduleInner,
  getTodaySchedule,
  deleteReservation,
  requestArrive,
};
