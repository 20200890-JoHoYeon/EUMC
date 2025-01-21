import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { EumcWaitingNumberEumcEntity } from '../../entities/eumc-waiting-number.eumc-entity';
import { MoreThan, Repository } from 'typeorm';
import { EumcPushEumcEntity } from '../../entities/eumc-push.eumc-entity';
import { EumcAppVersionEntity } from '../../entities/eumc-app-version.eumc-entity';
import { AppVersionInterface } from './dto/app-version.interface';
import { ReqSetAppPushDto } from './dto/req-set-app-push.dto';
import { EumcAppVersionRepoService } from "../../repo/eumc-app-version-repo.service";
import { EumcPushRepoService } from "../../repo/eumc-push-repo.service";
import { EumcPayEumcEntity } from "../../entities/eumc-pay.eumc-entity";
import { AlimtalkMgrEntity } from "../../entities/alimtalk-mgr.alimtalk-entity";

@Injectable()
export class EumcAppApiService {
  private readonly logger = new Logger(EumcAppApiService.name);

  constructor(
    private httpService: HttpService,
    private appVersionRepoService: EumcAppVersionRepoService,
    private pushRepoService: EumcPushRepoService,
    @InjectRepository(AlimtalkMgrEntity, "alimtalk")
    private alimtalkMgrEntityRepo: Repository<AlimtalkMgrEntity>
  ) {}

  async getAppVersionInfo(
    userVersion: string,
    osType: string,
  ): Promise<AppVersionInterface> {
    const result = {
      version: '',
      forceUpdate: 'N',
    } as AppVersionInterface;
    this.logger.debug(`앱버전정보 조회`);
    try {
      // 디비에서 최신버전 조회
      const foundOne = await this.appVersionRepoService.selectAppVersion(userVersion, osType);

      // TODO: 디비에 버전정보가 없다면 최신 버전으로 인식?
      if (foundOne != null) {
        let ver = foundOne.version;

        if (ver.length == 2) {
          ver = '0' + ver;
        }
        if (ver.length == 1) {
          ver = '00' + ver;
        }
        result.version = `${ver.charAt(0)}.${ver.charAt(1)}.${ver.charAt(2)}`;
        result.forceUpdate = foundOne.forceUpdate;
      } else {
        return null;
      }
    } catch (e) {
      this.logger.debug(`앱버전정보 조회 ERR : ${e}`);
    }
    return result;
  }

  async getPushInfo(patno: string) {
    this.logger.debug('푸시정보 조회 START');
    try {
      const foundOne = await this.pushRepoService.findOneByPatno(patno);

      if (foundOne == null) {
        throw `${patno} PUSH KEY 정보가 없음`;
      }

      return foundOne;
    } catch (e) {
      this.logger.error(`푸시정보 조회 ERR : ${e}`);
      throw e;
    }
  }

  async updatePushInfo(info: ReqSetAppPushDto) {
    this.logger.debug('푸시정보 갱신 START');
    try {
      const beforePush = await this.pushRepoService.findOneByPatno(info.patno);

      let saveOne = beforePush;
      if (saveOne == null) {
        // 그대로 저장
        saveOne = new EumcPushEumcEntity();
        saveOne.regDate = new Date();
      } else {
        // 업데이트
        saveOne.modifyDate = new Date();
      }

      saveOne.patno = info.patno;
      saveOne.appKey = 'a5f70288-e31f-4a3b-8fc6-79e8ebf91293';
      saveOne.osType = info.osType;
      saveOne.pushKey = info.pushKey;

      return await this.pushRepoService.pushEumcRepo.save(saveOne);
    } catch (e) {
      this.logger.error(`푸시정보 갱신 ERR ${e}`);
      throw e;
    }
  }

  async getAlimtalk() {
    this.logger.debug('푸시정보 조회 START');
    try {
      const foundOne = await this.alimtalkMgrEntityRepo.find();

      return foundOne;
    } catch (e) {
      this.logger.error(`푸시정보 조회 ERR : ${e}`);
      throw e;
    }
  }






}
