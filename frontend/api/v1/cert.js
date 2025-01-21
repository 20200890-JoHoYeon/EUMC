import axios from '../axios';

const SUB_DIR = '/v1/cert';

const getCertificationList = async (his_hsp_tp_cd, pt_no, fromdate, todate) =>
  await axios.get(`${SUB_DIR}/certificationList`, { params: { his_hsp_tp_cd, pt_no, fromdate, todate }});

const getRequestMakeCertPDF = async (
  his_hsp_tp_cd,
  patno,
  rcptype,
  certname,
  deptname,
  fromdate,
  todate,
  date,
  data,
  email
) =>
  await axios.post(`${SUB_DIR}/requestMakeCertPdf`, {
    his_hsp_tp_cd,
    patno,
    rcptype,
    certname,
    deptname,
    fromdate,
    todate,
    date,
    data,
    email,
  });

export { getCertificationList, getRequestMakeCertPDF };
