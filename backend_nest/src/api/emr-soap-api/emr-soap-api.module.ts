import { Module } from '@nestjs/common';
import { EmrSoapApiService } from './emr-soap-api.service';
import { HttpModule } from "@nestjs/axios";
import { HttpConfService } from "../../config/http/http-conf.service";
import { CommonConfService } from "../../config/common-conf.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
  ],
  providers: [EmrSoapApiService, CommonConfService],
  exports: [EmrSoapApiService],
})
export class EmrSoapApiModule {}
