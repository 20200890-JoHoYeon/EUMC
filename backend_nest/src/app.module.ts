import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import helmet from 'helmet';
import { CrytoUtil } from './utils/cryto.util';
import { CommonConfModule } from './config/common-conf.module';
import { HttpModule } from '@nestjs/axios';
import { SampleModule } from './sample/sample.module';
import { CertApiModule } from './api/cert-api/cert-api.module';
import { TicketApiModule } from './api/ticket-api/ticket-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonConfService } from './config/common-conf.service';
import { ReceiptApiModule } from './api/receipt-api/receipt-api.module';
import { PrescriptionApiModule } from './api/prescription-api/prescription-api.module';
import { PatientApiModule } from './api/patient-api/patient-api.module';
import { KakaoPayApiModule } from './api/kakao-pay-api/kakao-pay-api.module';
import { EumcAppApiModule } from './api/eumc-app-api/eumc-app-api.module';
import { EumcPayApiModule } from './api/eumc-pay-api/eumc-pay-api.module';
import { TicketClientModule } from './api/ticket-api/tcp/ticket-client.module';
import { EumcPayConfService } from './config/db/eumc-pay-conf.service';
// import { AlimtalkConfService } from './config/db/alimtalk-conf.service';
import { ScheduleModule } from '@nestjs/schedule';
import { OneSignalPushApiModule } from './api/one-signal-push-api/one-signal-push-api.module';
import { TicketScheduleService } from './api/ticket-api/ticket-schedule.service';
import { MedDeptApiService } from './api/med-dept-api/med-dept-api.service';
import { MedDeptApiModule } from './api/med-dept-api/med-dept-api.module';
import { PaymentApiModule } from './api/payment-api/payment-api.module';
import { ReservationApiModule } from './api/reservation-api/reservation-api.module';
import { EumcRepoModule } from "./repo/eumc-repo.module";
import { EmrSoapApiModule } from './api/emr-soap-api/emr-soap-api.module';
import { CommonModule } from './common/common.module';
import { ImgUtil } from "./utils/img.util";
import { LogApiModule } from "./api/log-api/log-api.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AlimtalkConfService } from "./config/db/alimtalk-conf.service";
import { AlimtalkApiService } from './api/alimtalk-api/alimtalk-api.service';
import { AlimtalkApiModule } from './api/alimtalk-api/alimtalk-api.module';


@Module({
  imports: [
    CommonConfModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../', 'public'),
    // }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../', 'views'),
    // }),
    TypeOrmModule.forRootAsync({
      name: 'eumc_pay',
      useClass: EumcPayConfService,
    }),
    TypeOrmModule.forRootAsync({
      name: 'alimtalk',
      useClass: AlimtalkConfService,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    SampleModule,
    EumcRepoModule,
    CertApiModule,
    ReceiptApiModule,
    PrescriptionApiModule,
    PatientApiModule,
    KakaoPayApiModule,
    EumcAppApiModule,
    EumcPayApiModule,
    LogApiModule,
    TicketApiModule,
    TicketClientModule,
    OneSignalPushApiModule,
    MedDeptApiModule,
    PaymentApiModule,
    ReservationApiModule,
    EmrSoapApiModule,
    CommonModule,
    AlimtalkApiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CommonConfService,
    CrytoUtil,
    ImgUtil,
    TicketScheduleService,
    AlimtalkApiService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {

    const cspOptions = {
      directives: {
        // 헬멧 기본 옵션 가져오기
        ...helmet.contentSecurityPolicy.getDefaultDirectives(), // 기본 헬멧 설정 객체를 리턴하는 함수를 받아 전개 연산자로 삽입

        /*
        none : 어떳 것도 허용하지 않음
      self : 현재 출처에서는 허용하지만 하위 도메인에서는 허용되지 않음
      unsafe-inline : 인라인 자바스크립트, 인라인 스타일을 허용
      unsafe-eval	: eval과 같은 텍스트 자바스크립트 메커니즘을 허용
        */
        // 구글 API 도메인과 인라인 스크립트, eval 스크립트를 허용
        "script-src": ["'self'", "*.kcp.co.kr", "'unsafe-inline'", "'unsafe-eval'"],

        // 소스에 https와 http 허용
        "base-uri" : ["/", "http:"],
      }
    }


    // helmet -> HTTP Header보안설정
    consumer
      .apply(helmet({
        contentSecurityPolicy: cspOptions,
      }), LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    // .forRoutes(CatsController)
  }
}
