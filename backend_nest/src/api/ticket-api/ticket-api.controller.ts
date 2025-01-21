import {
  Body,
  Controller,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TicketApiService } from './ticket-api.service';
import { CommonTicketRequestDto } from '../../common/dto/tcp/common-ticket-request.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { ApiResult } from '../../const/api-result.const';
import { ReqCallWaitNumberDto } from './dto/req-call-wait-number.dto';

@Controller('api/v1/ticket')
@ApiTags('티켓 API')
export class TicketApiController {
  private readonly logger = new Logger(TicketApiController.name);

  constructor(private readonly ticketApiService: TicketApiService) {}

  @Post('/waitingListSeoul')
  @ApiOperation({ summary: '대기 리스트 요청(서울)-병원서버 API 사용' })
  @ApiBody({
    description: '환자번호',
    required: true,
    schema: {
      properties: {
        patno: { type: 'string' },
      },
    },
  })
  async waitNumberList(@Body('patno') pt_no: string) {
    const resp = new ResponseDto();
    try {
      const waitList = await this.ticketApiService.reqWaitNumberList(pt_no);
      resp.setSuccess(waitList);
    } catch (e) {
      this.logger.error(`대기 리스트 요청 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }

  @Post('/requestWaitingNumberSeoul')
  @ApiOperation({ summary: '번호표 요청(서울)-병원서버 API 사용' })
  @ApiBody({
    description: '환자등록번호',
    required: true,
    schema: {
      properties: {
        divId: { type: 'string' },
        regNo: { type: 'string' },
      },
    },
  })
  async waitingNumberSeoul(
    @Body('divId') div_id: string,
    @Body('regNo') reg_no: string,
  ) {
    const resp = new ResponseDto();
    try {
      const waitNumberResp = await this.ticketApiService.reqWaitNumber(
        div_id,
        reg_no,
      );
      resp.setSuccess(waitNumberResp);
    } catch (e) {
      this.logger.error(`대기번호 요청(서울) 요청 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }

  @Post(['/waitingList', '/waitingListMockdong'])
  @ApiOperation({ summary: '번호표 리스트 조회' })
  @ApiBody({
    description: '번호표 리스트 조회 파라메터',
    required: true,
    type: CommonTicketRequestDto,
  })
  async waitingList(@Body() req: CommonTicketRequestDto) {
    const resp = new ResponseDto();
    try {
      // 대기 리스트 수신
      const wait_cnt_list_str =
        await this.ticketApiService.getWaitingListFromTicketServer(req);

      // 대기 리스트 가공
      resp.setSuccess(
        await this.ticketApiService.getWaitingNumberInfo(
          req.patNo,
          wait_cnt_list_str,
        ),
      );
    } catch (e) {
      this.logger.error(`번호표 리스트 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }

    return resp;
  }

  @Post('/requestTicket')
  @ApiOperation({ summary: '번호표 요청' })
  @ApiBody({
    description: '번호표 요청 파라메터',
    required: true,
    type: CommonTicketRequestDto,
  })
  async requestTicket(@Body() req: CommonTicketRequestDto) {
    const resp = new ResponseDto();
    try {
      // 대기 리스트 수신
      const respTicketNumber =
        await this.ticketApiService.requestTicketToTicketServer(req);

      // 대기 리스트 가공
      resp.setSuccess(respTicketNumber);
    } catch (e) {
      this.logger.error(`번호표 요청 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }

  @Post('/callWaitingNumber')
  @ApiOperation({
    summary:
      '대기번호 상태 갱신 - 발권기(KIOSK의 응답으로 인해 중계서버가 자체요청,' +
      ' 응답데이터는 OneSignal 환자호출 API 요청에 사용됨',
  })
  @ApiBody({
    description: '대기번호 상태 갱신 파라메터들',
    required: true,
    schema: {
      properties: {
        hsp_tp_cd: { type: 'string', description: '병원코드', example: '01' },
        kioskIp: {
          type: 'string',
          description: '키오스크IP',
          example: '10.10.210.65',
        },
        patno: { type: 'string', description: '환자번호', example: '96476189' },
        menu: { type: 'number', description: '부서번호', example: 5 },
        callNo: { type: 'number', description: '대기번호', example: 2 },
        desk: { type: 'number', description: '대기번호', example: 2  },
      },
    },
  })
  async callWaiting(@Body() body: ReqCallWaitNumberDto) {
    const resp = new ResponseDto();
    try {
      const resultCode = await this.ticketApiService.updateCallStatus(
        body.hsp_tp_cd,
        body.kioskIp,
        body.menu,
        body.patno,
        body.callNo,
        body.desk
      );
      if (resultCode == 1) {
        resp.setSuccess('OK');
      } else {
        resp.setError(ApiResult.UNKNOWN_ERROR);
      }
    } catch (e) {
      this.logger.error(`대기번호 상태 갱신 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }
}
