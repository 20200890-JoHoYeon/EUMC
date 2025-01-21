import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import * as net from 'net';
import { CommonConfService } from '../../../config/common-conf.service';
import { TicketServerTcp } from '../../../dto/ticket-server-tcp/kiosk-server-tcp.interface';
import { CommonTicketRequestDto } from '../../../common/dto/tcp/common-ticket-request.dto';
import { PatientCallData } from '../../one-signal-push-api/dto/patient-call-data.interface';
import { OneSignalPushApiService } from '../../one-signal-push-api/one-signal-push-api.service';
import { CommonCodeConst } from "../../../const/common-code.const";
import { TicketApiService } from "../ticket-api.service";

interface TicketClientReqDataSet {
  SEND_CMD: string;
  TICKET_NUM?: string;
  SERVER_IDX?: number;

  DATA?: CommonTicketRequestDto;
}

@Injectable()
export class TicketClientService {
  private readonly logger = new Logger(TicketClientService.name);

  private socket: net.Socket;
  private options: net.TcpSocketConnectOpts;

  private clientCallMap: Map<string, TicketClientReqDataSet> = new Map<
    string,
    TicketClientReqDataSet
  >();

  // Disconnect 시 재연결관련
  private readonly TRY_RECONNECT = true as boolean;
  private readonly TRY_RECONNECT_TIMEMILLS = 5000 as number;
  private TRY_RECONNECT_SCHD: NodeJS.Timeout;

  constructor(
    private commonConfService: CommonConfService,
    @Inject(forwardRef(() => TicketApiService))
    private ticketApiService: TicketApiService,
    private oneSignalPushApiService: OneSignalPushApiService,
  ) {}

  isConnected(): boolean {
    return this.socket != null && this.socket.writable;
  }

  async connectServer(
    connectOpts: TicketServerTcp | net.TcpSocketConnectOpts,
  ): Promise<net.Socket> {
    try {
      this.options = {
        host: connectOpts.host,
        port: connectOpts.port,
        noDelay: true,
        keepAlive: true,
      };

      // 서버 접속시도시 이전 연결 초기화
      if (this.socket != null) {
        //재시도 중이라면 타이머 취소
        if (this.TRY_RECONNECT_SCHD != null) {
          global.clearTimeout(this.TRY_RECONNECT_SCHD);
          this.TRY_RECONNECT_SCHD = null;
        }

        this.socket.removeAllListeners();
        this.socket.destroy();
      }

      this.socket = await net.connect(this.options, () => {
        this.logger.verbose(
          `SOCKET CONNECTED OPTS : ${JSON.stringify(this.options)}`,
        );

        // SET ENCODING
        this.socket.setEncoding('utf8');
      });
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(
        {
          message: '000 API 요청에러',
          error: e,
          code: '8000',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.socket.on('timeout', () => {
      this.logger.error(`SOCKET TIMEOUT`);

      //TODO: 재연결 프로세스를 넣을지 선택해야함
      this.tryReconnect();
    });
    // 위의 connectionListener 와 동일
    // this.socket.on('connect', () => {
    //   this.logger.log(`TCP CONNECT START OPTS : ${JSON.stringify(this.options)}`,);
    // });

    this.socket.on('data', (data) => {
      this.logger.debug(
        `SOCKET RECV FROM ${this.options.host} : ${data.toString()}`,
      );
      const resp = this.handleMessage(data.toString());
      // if(resp != null){
      //   this.sendMessage(resp);
      // }
    });

    this.socket.on('end', () => {
      this.logger.verbose(
        `SOCKET DISCONNECTED : ${JSON.stringify(this.options)}`,
      );

      //TODO: 재연결 프로세스를 넣을지 선택해야함
      this.tryReconnect();
    });

    this.socket.on('close', () => {
      this.logger.error(`SOCKET CLOSE`);
      this.socket.destroy();

      //TODO: 재연결 프로세스를 넣을지 선택해야함
      this.tryReconnect();
    });

    this.socket.on('error', (err) => {
      this.logger.error(`SOCKET ERR : ${err.message}`);
    });

    return this.socket;
  }

  /**
   * 어느 서버로 전송할지 지정 필요
   * @param sendData
   */
  async sendMessage(sendData: TicketClientReqDataSet): Promise<any> {
    let isOk = false;
    const targetServer: TicketServerTcp =
      this.commonConfService.getActiveTickerServerInfo();

    return new Promise(async (resolve, reject) => {
      try {
        // 미 연결상태 일때 연결 시도
        if (this.socket == null || this.socket.destroyed) {
          this.socket = await this.connectServer(targetServer);
        }

        isOk = this.socket.write(Buffer.from(JSON.stringify([sendData.DATA.msg])), () => {
          this.logger.debug(`SOCKET WRITE : ${JSON.stringify([sendData.DATA.msg])}`);

          // 전송정보를 저장해 놓고
          // DATA : CommonTicketRequestDto

          //FIXME: 발권서버(TCP)로 전송후 응답으로 처리하기에 필요없음
          // if (sendData.SEND_CMD == 'WAIT') { // 대기 리스트
          //        this.clientCallMap.set(sendData.DATA.patNo, sendData);
          // } else if (sendData.SEND_CMD == 'CALL') { // 환자 호출
          //   this.clientCallMap.set(sendData.DATA.patNo, sendData);
          // }
          // else if (sendData.SEND_CMD == 'ISSUE') { // 번호표 요청
          //   this.clientCallMap.set(sendData.DATA.patNo, sendData);
          // }

          this.socket.once('data', (data) => {
            this.logger.debug(
              `SOCKET RETURN FROM ${this.options.host} : ${data.toString()}`,
            );
            resolve(data);
          });
        });

        if (!isOk) {
          reject(false);
        }
      } catch (e) {
        this.logger.error(e);

        throw new HttpException(
          {
            message: '000 API 요청에러',
            error: e,
            code: '8000',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }

  handleMessage(data: string | PatientCallData) {
    this.logger.debug(`HANDLE MSG START : ${data}`);
    const result = null;
    try{

      // {"SYSTEM":1,"CMD":"CALL2", "K_IP":"10.10.210.66", "MENU":1, "PATIENT":12009954, "CALL_NO":291, "DESK":22}
      if (typeof data == 'string') {
        data = JSON.parse(data + '');
      }
      if(data instanceof Array) {
        data = data.length > 0 ? data[0] : {};
      }

      const patientCallData = data as PatientCallData;
      if (patientCallData.SYSTEM != 9) {
        // const clientData = this.clientCallMap.get(
        //   patientCallData.PATIENT + '',
        // );
        // const playerId = clientData.DATA.playerId;

        // 순번 대기 리스트
        // if (clientData.SEND_CMD == 'WAIT') {
        //   // promise에서 바로처리하기에 처리 불필요?
        // } else {
        // 목동 환자 호출
        if (patientCallData.CMD == 'CALL2') {


          this.ticketApiService.updateCallStatus(
            CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,
            patientCallData.K_IP,
            patientCallData.MENU,
            patientCallData.PATIENT + '',
            patientCallData.CALL_NO,
            (typeof patientCallData.DESK == 'undefined' ? null : patientCallData.DESK)
          )
            .then(upt_resp => {
              this.logger.log(`UPDATE CALL STATUS RESULT : ${upt_resp}`)
            })


          // this.oneSignalPushApiService.patientCallFromTicketServer(
          //   'CALL',
          //   clientData.DATA.playerId,
          //   {
          //     hsp_tp_cd: CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,
          //     kioskIp: patientCallData.K_IP,
          //     patno: patientCallData.PATIENT + '',
          //     menu: patientCallData.MENU,
          //     callNo: patientCallData.CALL_NO,
          //     desk: (typeof patientCallData.DESK == 'undefined' ? null : patientCallData.DESK)
          //   },
          // );
          // this.clientCallMap.delete(patientCallData.PATIENT + '');
        }

        // FIXME: 이 아래 블록은 사용되는건가?
        else if (patientCallData.DEPT != null) {
          // if (patientCallData.STATUS != 1 && patientCallData.STATUS != 4) {
          //   this.oneSignalPushApiService.patientCallFromTicketServer(
          //     clientData.DATA.type,
          //     clientData.DATA.playerId,
          //     {
          //       hsp_tp_cd: CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,
          //       kioskIp: patientCallData.K_IP,
          //       patno: patientCallData.PATIENT + '',
          //       menu: patientCallData.MENU,
          //       callNo: patientCallData.CALL_NO
          //     },
          //   );
          // }

          // this.clientCallMap.delete(patientCallData.PATIENT + '');
          // }
        }

      }
    }catch (e) {
      this.logger.error(`HANDLE MSG ERR ${e}`);
      return null;
    }
    return result;
  }

  /**
   * 재연결 프로세스
   */
  async tryReconnect() {
    if (this.TRY_RECONNECT && this.TRY_RECONNECT_SCHD == null) {
      this.TRY_RECONNECT_SCHD = setTimeout(() => {
        this.logger.error(`SOCKET RECONNECT`);
        this.connectServer(this.options);
      }, this.TRY_RECONNECT_TIMEMILLS);
    }
  }
}
