import axios from '../axios';

const SUB_DIR = '/v1/eumc-pay';

const regTrade = async (ordr_idxx, site_cd) => await axios.post(`${SUB_DIR}/reg-trade`, { ordr_idxx, site_cd });
const regTradeNormal = async (ordr_idxx, site_cd, good_name, good_mny) => await axios.post(`${SUB_DIR}/reg-trade-normal`, {
  ordr_idxx,
  site_cd,
  good_name,
  good_mny,
});

const reqAuthHash = async (site_cd) => await axios.post(`${SUB_DIR}/auth_hash`,
  { site_cd });


const reqAuthNumber = async (
  site_cd,
  pt_no,
  media_type,
  user_name,
  phone_no,
  comm_id,
  birth_day,
  sex_code,
  local_code,
  cp_sms_msg,
  cp_callback,
  per_cert_no
) =>
  await axios.post(`${SUB_DIR}/req_auth_number`, {
    site_cd,
    pt_no,
    media_type,
    user_name,
    phone_no,
    comm_id,
    birth_day,
    sex_code,
    local_code,
    cp_sms_msg,
    cp_callback,
    per_cert_no
  });



/**
 *  {"phone_no":"01023796497",
 *  "res_msg":"정상처리",
 *  "user_name":"오영재",
 *  "cert_num_guard_yn":"N",
 *  "comm_id":"KTM",
 *  "local_code":"",
 *  "res_cd":"0000",
 *  "sex_code":"",
 *  "birth_day":"",
 *  "per_cert_no":"23860089863355",
 *  "safe_guard_yn":"N",
 *  "van_res_cd":"C1000",
 *  "iden_only_yn":"N",
 *  "van_tx_id":"K26170934121518RSRCR",
 *  "auth_tx_id":"",
 *  "order_id":"20230818179"}
 */
const reqAuthConfirm = async (
  site_cd,
  comm_id,
  per_cert_no,
  otp_no,
  adl_agree_yn
) =>
  await axios.post(`${SUB_DIR}/req_auth_confirm`, {
    site_cd,
    comm_id,
    per_cert_no,
    otp_no,
    adl_agree_yn
  });

const cbKCPBatch = async () => await axios.post(`${SUB_DIR}/callback_kcp_batch`);

const getPaymentList = async (his_hsp_tp_cd, pat_no) =>
  await axios.get(`${SUB_DIR}/cardList`, { params: { his_hsp_tp_cd, pat_no } });

const deletePaymentCard = async (seq) =>
  await axios.delete(`${SUB_DIR}/card/${seq}`, {});


/**
 *   his_hsp_tp_cd: { type: 'string' },
 *         patno: { type: 'string' },
 *         bt_batch_key: { type: 'string' },
 *         good_mny: { type: 'string' },
 *         buyr_name: { type: 'string' },
 *         data_set: {type: 'string'}
 * @param his_hsp_tp_cd
 * @param patno
 * @param bt_batch_key
 * @param rcp_type
 * @param good_mny
 * @param data_set
 * @return {Promise<axios.AxiosResponse<any>>}
 */
const paymentSmart = async (his_hsp_tp_cd, pat_no, bt_batch_key, rcp_type, good_mny, data_set) =>
  await axios.post(`${SUB_DIR}/paymentSmart`, { his_hsp_tp_cd, pat_no, bt_batch_key, rcp_type, good_mny, data_set });


export {
  regTrade,
  regTradeNormal,
  reqAuthHash,
  cbKCPBatch,
  getPaymentList,
  deletePaymentCard,
  paymentSmart,
  reqAuthNumber,
  reqAuthConfirm
};
