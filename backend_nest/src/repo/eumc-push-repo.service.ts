import { Column, DataSource, Entity, MoreThan, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { TicketClientService } from "../api/ticket-api/tcp/ticket-client.service";
import { OneSignalPushApiService } from "../api/one-signal-push-api/one-signal-push-api.service";
import { InjectRepository } from "@nestjs/typeorm";
import { EumcWaitingNumberEumcEntity } from "../entities/eumc-waiting-number.eumc-entity";
import { EumcAppVersionEntity } from "../entities/eumc-app-version.eumc-entity";
import { EumcPushEumcEntity } from "../entities/eumc-push.eumc-entity";

@Injectable()
export class EumcPushRepoService {
  private readonly logger = new Logger(EumcPushRepoService.name);


  constructor(
    @InjectRepository(EumcPushEumcEntity, 'eumc_pay')
    public pushEumcRepo: Repository<EumcPushEumcEntity>,
  ) {
  }


  async findOneByPatno(patno: string) {
    const foundOne = await this.pushEumcRepo.findOne({
      where: {
        patno: patno,
      },
    });

    return foundOne;
  }





}
