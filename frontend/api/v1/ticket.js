import axios from '../axios';

const SUB_DIR = '/v1/ticket';

const getWaitingListSeoul = async patno => await axios.post(`${SUB_DIR}/waitingListSeoul`, { patno });
const getWaitingListMokdong = async (patNo, playerId) =>
  await axios.post(`${SUB_DIR}/waitingList`, {
    type: 'call',
    patNo,
    playerId,
    ticketServerIdx: 0,
    msg: {
      SYSTEM: 1,
      CMD: 'WAIT',
      PATIENT: patNo,
    },
  });
const requestWaitingNumberSeoul = async (divId, regNo) =>
  await axios.post(`${SUB_DIR}/requestWaitingNumberSeoul`, { divId, regNo });

const requestWaitingNumberMokdong = async (divId, regNo, menu) =>
  await axios.post(`${SUB_DIR}/requestTicket`, {
    msg: {
      SYSTEM: 1,
      CMD: 'ISSUE',
      MENU: menu,
      K_IP: divId,
      PATIENT: regNo,
    }
  });

export { getWaitingListSeoul, getWaitingListMokdong, requestWaitingNumberSeoul, requestWaitingNumberMokdong };
