import { Column, DataSource, Entity, MoreThan, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { TicketClientService } from "../api/ticket-api/tcp/ticket-client.service";
import { OneSignalPushApiService } from "../api/one-signal-push-api/one-signal-push-api.service";
import { InjectRepository } from "@nestjs/typeorm";
import { EumcWaitingNumberEumcEntity } from "../entities/eumc-waiting-number.eumc-entity";
import { EumcAppVersionEntity } from "../entities/eumc-app-version.eumc-entity";





@Injectable()
export class EumcAppVersionRepoService {
  private readonly logger = new Logger(EumcAppVersionRepoService.name);

  constructor(
    @InjectRepository(EumcAppVersionEntity, 'eumc_pay')
    public eumcAppVersionEntityRepo: Repository<EumcAppVersionEntity>,
  ) {
  }


  async selectAppVersion(userVersion: string, osType: string) {
    const foundOne = await this.eumcAppVersionEntityRepo.findOne({
      where: {
        version: MoreThan(userVersion),
        osType: osType,
      },
    });

    return foundOne;
  }





}
