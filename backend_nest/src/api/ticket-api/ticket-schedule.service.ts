import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EumcWaitingNumberEumcEntity } from '../../entities/eumc-waiting-number.eumc-entity';
import { MoreThan, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TicketScheduleService {
  private readonly logger = new Logger(TicketScheduleService.name);

  constructor(
    @InjectRepository(EumcWaitingNumberEumcEntity, 'eumc_pay')
    private eumcWaitingNumberRepo: Repository<EumcWaitingNumberEumcEntity>,
  ) {}

  /**
   * 매일 저녁 6시에 변호표정보 상태변경 - 업무종료시각
   */
  @Cron('0 0 18 * * *')
  async updateCallStatusAuto() {
    this.logger.verbose('SCHEDULE - 번호표 정보 갱신 START');
    try {
      // 2. DB 저장
      const compareTime = new Date().getTime() + 3600 * 10;
      const foundOne = await this.eumcWaitingNumberRepo.findBy({
        regDate: MoreThan(new Date(compareTime)),
        status: 0,
      });

      if (foundOne != null && foundOne.length > 0) {
        foundOne.forEach((item, idx) => {
          item.status = 1;
          item.callDate = new Date();

          const dbOk = this.eumcWaitingNumberRepo.update(item.seq, item);
          this.logger.verbose(
            `번호표 데이터 디비저장 결과 : ${JSON.stringify(dbOk)}`,
          );
        });
      }
    } catch (e) {
      this.logger.debug(`번호표 정보 갱신 ERR : ${e}`);
    }
  }
}

