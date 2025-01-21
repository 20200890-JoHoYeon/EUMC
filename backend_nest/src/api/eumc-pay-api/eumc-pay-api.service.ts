import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from '@nestjs/config';
import { CrytoUtil } from "../../utils/cryto.util";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { EumcPayEumcEntity } from "../../entities/eumc-pay.eumc-entity";
import * as fs from "fs";
import * as crypto from "crypto";
import fetch from "node-fetch";
import { ReqKcpPayment } from "./dto/req-kcp-payment.interface";
import * as moment from "moment-timezone";
import { CommonCodeConst, RCP_TYPE } from "../../const/common-code.const";
import {
  ReqInternetDeptRoomArrivalConfirm
} from "../emr-soap-api/dto/req-internet-dept-room-arrival-confirm.interface";
import { EumcKakaopayEumcEntity } from "../../entities/eumc-kakaopay.eumc-entity";
import { PaymentApiService } from "../payment-api/payment-api.service";
import { CertApiService } from "../cert-api/cert-api.service";
import { PaymentSave } from "../cert-api/dto/payment-save.interface";
import { RespKcpPayment } from "./dto/resp-kcp-payment.interface";
import { PaymentSaveI } from "../cert-api/dto/payment-save-i.interface";
import { ReqMakeCertPdf } from "../cert-api/dto/req-make-cert.pdf";
import { ReqKcpOtpConfirm } from "./dto/req-kcp-otp-confirm.interface";
import { catchError, lastValueFrom } from "rxjs";
import { AxiosError } from "axios";



export interface KcpCertInfo {
  SITE_CD: string;
  CERT_STR: string;
  CERT_FILE_PATH: string;
  PK_PASSWORD: string;
};


@Injectable()
export class EumcPayApiService {
  private readonly logger = new Logger(EumcPayApiService.name);

  private readonly KCP_CERT_INFO = '-----BEGIN CERTIFICATE-----MIIDgTCCAmmgAwIBAgIHBy4lYNG7ojANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMTA2MjkwMDM0MzdaFw0yNjA2MjgwMDM0MzdaMHAxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTERMA8GA1UECgwITG9jYWxXZWIxETAPBgNVBAsMCERFVlBHV0VCMRkwFwYDVQQDDBAyMDIxMDYyOTEwMDAwMDI0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAppkVQkU4SwNTYbIUaNDVhu2w1uvG4qip0U7h9n90cLfKymIRKDiebLhLIVFctuhTmgY7tkE7yQTNkD+jXHYufQ/qj06ukwf1BtqUVru9mqa7ysU298B6l9v0Fv8h3ztTYvfHEBmpB6AoZDBChMEua7Or/L3C2vYtU/6lWLjBT1xwXVLvNN/7XpQokuWq0rnjSRThcXrDpWMbqYYUt/CL7YHosfBazAXLoN5JvTd1O9C3FPxLxwcIAI9H8SbWIQKhap7JeA/IUP1Vk4K/o3Yiytl6Aqh3U1egHfEdWNqwpaiHPuM/jsDkVzuS9FV4RCdcBEsRPnAWHz10w8CX7e7zdwIDAQABox0wGzAOBgNVHQ8BAf8EBAMCB4AwCQYDVR0TBAIwADANBgkqhkiG9w0BAQsFAAOCAQEAg9lYy+dM/8Dnz4COc+XIjEwr4FeC9ExnWaaxH6GlWjJbB94O2L26arrjT2hGl9jUzwd+BdvTGdNCpEjOz3KEq8yJhcu5mFxMskLnHNo1lg5qtydIID6eSgew3vm6d7b3O6pYd+NHdHQsuMw5S5z1m+0TbBQkb6A9RKE1md5/Yw+NymDy+c4NaKsbxepw+HtSOnma/R7TErQ/8qVioIthEpwbqyjgIoGzgOdEFsF9mfkt/5k6rR0WX8xzcro5XSB3T+oecMS54j0+nHyoS96/llRLqFDBUfWn5Cay7pJNWXCnw4jIiBsTBa3q95RVRyMEcDgPwugMXPXGBwNoMOOpuQ==-----END CERTIFICATE-----';


  // cert string
  // file path
  //
  getCertInfo(hsp_tp: string, type: string): KcpCertInfo{
    let cert_info = {
      SITE_CD: 'A52Q7',
      CERT_STR: this.KCP_CERT_INFO,
      CERT_FILE_PATH: '../../../cert/A8IE7.pem',
      PK_PASSWORD: 'vhTldlghk0!'
    } as KcpCertInfo;

    // 제증명은 인증서 1개
    if(type == 'PROOF'){
      cert_info = {
        SITE_CD: 'A8IE7',
        CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/22mzrxDANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA2MjEwNjU2MTZaFw0yODA2MTkwNjU2MTZaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNjIxMTAwMDUzMDkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCTCVQlUVnx/DPS4dgUOs9S/2g4xG9pG89BzHbjcHgjlRyH3uSUqGoAmiPoarU1ZmOBg8XoVW+rV0KcG6cUR3GNUREaC8EcTA8+ISGdN0IgNhqXo4jsGggBrhElN87fcnPgryPK/SPdL0CBcLztSgePBsFoYM+OkobW28sPlYYrRYDQFV6mLc5LXPqybWNxUwRdcfPlOILzbYzAZU3d3M+W/qlB5neWRtEDrt9Pj7NlA49Wm6M53iIwvzZUJFW01wtwU6PfTUWVMt/guBc0Il9eqdsPtBzYgkMugKsQC+NqVPyX42DwVtOQ3ipUHaXKiBrB414tDJBVHQdPuyYO2aWTAgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQBO9jOR/TZG1Zn80d69/VIT4bOiforlQTsfol2S/x56dO5uZq8DNM08mc7XL2lSyaUo7BLP9/CxvAa+apmjGFP78s30eWhZW8IXNrIpCeRe/QTuoqszp2Vw+Ud9FAeC+hALsdKaz7p6yEFDbZWVkCWCR83MohZhJTO7PJ/1A6U1zbh49EWh9h0A9p9pS/strY+LomxEeARQ/oy0GG0pZoZVSDOwdPy6O5qTXTdvA6KEHVIEbwHvJrGwxVyaJMs3bDdscT8Vn5cZfZkaq6fs6K6Fn9/mtUeZ6JW9peenT2/wKRAVttLdJkzEMFfjl0oe5sGWGovglcXEFw/lRaKDRnAM-----END CERTIFICATE-----',
        CERT_FILE_PATH: '../../../cert/A8IE7.pem',
        PK_PASSWORD: 'vhTldlghk0!'
      };
    }else if(type == 'NORMAL_PAY'){
      if(hsp_tp == CommonCodeConst.HIS_HSP_TP_CD_SEOUL){
        cert_info = {
          SITE_CD: 'A8DZL',
          CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/24GLMxjANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA2MjIwMTQ4MzRaFw0yODA2MjAwMTQ4MzRaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNjIyMTAwMDUzMTEwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDQItDC890H6k6VaORzosK5IcfHYV3X7aQr0O8oACklPttgzm+H6bY2eCIZoB+SrgHSw87RXNFSCSZbi1l3r5GeDNnJYxgUvJxnW1LCKSFtPQKoEmoy4XYZxsA6q7MTq+dQhgZOjdSFXHKgBXBV6I9Fn+vWIv4UmXQZ8X03pmZN7qxmKCSg3gJX8M9iXS4U5dntztQexhy3XJdBo0AuE9H+xd+whWfUyoHzCWb/vZ1DtcjR/BRvz1GyGmuXTXSYMaUV/Y85UISFeBOe/IEQ2ae69GfqW4IWY3W+z9nsRu5dzK1tv+VRICYZMMXhzXH0Nzx3u7/2E4x1VOTi8eD7hVR/AgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQBDp/phToFqQUjB1l+nV1O0F9mLCTcijEQ67m0DU0NgZcfNIjntr3UOQu2zi3x2NgZTLR6WsNdJhLxRgJjWSiTc7NZxsoSMoAKwsaQF60hsGpQ7qQLY98uBznj64BTCL6n7EZGDXnLipVxjcBUm5q6/IVRofyiDrEjTrG27nlA76inCRHZKMwmx21yAJRV0ew7EZpyTr0w02YG2FLAULQ/uFiuKznBTRksDkfCE+yWMHfYUeUbWs0Kw77z7R3/il1bS+sCTVIzD/awyRKLint2pbtI2ObBiVs2QT58EcYbl1Zcb95Xzh60aJcB6oRmrXh6IZTkly4Hh2gKUWiXuXCt/-----END CERTIFICATE-----',
          CERT_FILE_PATH: '../../../cert/A8DZL.pem',
          PK_PASSWORD: 'eumc5115!'
        };
      }else{
        cert_info = {
          SITE_CD: 'A8DZT',
          CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/24GLMyDANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA2MjIwMTUzNTBaFw0yODA2MjAwMTUzNTBaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNjIyMTAwMDUzMTMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCLtMX2W7nRRGjIK625FqVdbSK7cj7VBra7k/roY9VhK+q0GhcvX3hg+zqWCuyuu5/ScZi1dG7lopz9lt3XTwItBBmG/kwYgfGPWbbGkMAmQ30dEqN40uFYd1pr8ZIKYUO4EqAIRtHWm0Xa0qlNgTCB1G89lSOIpQMNqIiy+LRfoE965g/xgyX7u3F65vnNsw2s27JRlMtcR6koMDgdaz33idLn9hTbF3gWhL6MRELBnjwfrbxV/Clnk47EQDcm71+Mrvot2H/yw4picOVgtdQxwwSkCBGGKY8UNbvf2v4f4k0GsejfXFEK9V/SXgVgiH771+dgiBtm96tPgSGnFoODAgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQBLDDBjuaqCleIaDddXJHVRnvhi4A8RcJ7YN2Kllr/Bvw3LptzU4es/rXZgUSPuMvuzfmLEZiw6AIsXci3+BZcVz9Ifk1syXbIcWM80+4kWTZQOlBrOrBYj3D6e3PXtvzfVdcfJQwEtTtLxvNA/gEDiacJocBVWe8dC2cU3jyb6diGBCfAJRiPJ5osfYF+Bwwl69t9NCMKXd7guVjI0Xfkvd0WYNiJ1fJMe5nPYH6SACk00kVA8BOmf5Q5oOqh34A88Hy3cGGnGwfZzU7Aiob711+ngh28l2q34lhI76X3h3tN6iBZVD17RzEz6kcalW0S1P90KCzXyPjfpM6CFzI1o-----END CERTIFICATE-----',
          CERT_FILE_PATH: '../../../cert/A8DZT.pem',
          PK_PASSWORD: 'eumc5115!'
        };
      }
    }else if(type == 'SMART_PAY') {
      if(hsp_tp == CommonCodeConst.HIS_HSP_TP_CD_SEOUL){
        cert_info = {
          SITE_CD: 'A8DZI',
          CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/24GLMxTANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA2MjIwMTQ0MDFaFw0yODA2MjAwMTQ0MDFaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNjIyMTAwMDUzMTAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCVAdYL6tBH5UAIt08tAKGPQkGeAaDI4K1V78lyGn2XrDE5kEVJ13SQKha0eAKzJlJ9p0RWpSu1DlinW7YI/K520maOSeWzeUjlYmcPJ93gNQoO2in2qzEFNDN5u9GXJe8MJQ98S0O3aUzCvZ5sb29kWzuKNfwFlDW1Z/2CRDixHhEAQSRg9LSrIcH3efbOtQog3US7jyYsRq4sTCtcsWST19DwXLW+UhWTEKe9cDuvtZOoagKf+S5edP+V0v3me4jAeio3sfPlUH63YStSwmoPOSYs2zCTlOn2lfknaL70JcOJdkrEruIMCbHTqHOnvf527RuVkJhKy2CHYdDw0vS/AgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQAWRLM1XJkwV0yx0S32SfQIF7XO9K+iHNrkTae0e6jq2vjtK5M6aeM4OGcHRzGLPyW+EjHZjVSwW8qRK04cg574tZWb50i8xln+Wm8BnAbmd1fcTLcFIfx46e3DZN00LsHxvekPu6fQDjmjSYW3EuFPs9QRYGd7hKl5ClEOoa7IsBezbDXsMB2T7kBsRpyfEvsuQGdaR+sZ2aYHBsjZ9hB7VI5TW73kJ0+nL5qiQPubEUFDvC20sDkwn5hR14apPgE9NAH+BE0YD9MuqQuTASt6Sy6DCzUBy7IN6BN98AQs4tyVxSb5i2nqTC1s/MjTBMpZH1QlKgp29vID+jDoVsje-----END CERTIFICATE-----',          CERT_FILE_PATH: '../../../cert/A8DZI.pem',
          PK_PASSWORD: 'EUMCSE5821!'
        };
      }else{
        cert_info = {
          SITE_CD: 'A8DZR',
          CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/24GLMxzANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA2MjIwMTUxMjRaFw0yODA2MjAwMTUxMjRaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNjIyMTAwMDUzMTIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCIUHRkifPpxvcMrCTUDaeaS/rhaJkp1h7/b5oiuYrExDTSJYzyuqEEMt9Syhku8eJFZvSVa7MO2WZmSvOWEvC86Mmq5b2KDpwp9TKdGrUXL8uiOYc+yNDLyfa/hVnYRdi5J2OR3WyqgzEBFZQECppeCEOu5SZCm7A8zgTBgc3SZNfmYFD3MlS/YcvnSDxdu/Ys6EcNVYhBuprGqoxw2zmYSKtlqey8/ZLfvtUau4/gmHDN1BJ0qA3vRXCv+KpxBZ4/PnkUrFiQB8Nw66M4u2Xtk49HULh0B8/wb8SOByA5uESvmjg3QD2aaX2nk4AiRzrwv+TqYmIi8zRkYdaD2sNBAgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQC8O6gRlHZTU7IdkbvYCYmaQlMfv3EJlXoGPE8PLUIGEIuR2Zv/SOZcjFloilSK8rDCKFzFnh9l6X6r6X7nJzwF2ss6ofUdJePBglKhUzBuXwx6kY5Nh7exYF0KR+2KDNnPSG1c3Q6hfXpUwv0ravVs2KqOx9GJbHzluMmItOXmWDApA7HIhlY9gb2mruBcU4AZW3vUjUHc99bX2nhYiq6SndOlutQyFt/K1BiskfvpFOC4gyPYkIZF1bGOBv1Ys6csqRE/4E0bzX3dlztcI2VLPBT18N+TaZY/2Khkmv2TEpKVyaNzemyJtvpiqczdeY70kQZw4PI71Q3HXecVCtP3-----END CERTIFICATE-----',
          CERT_FILE_PATH: '../../../cert/A8DZR.pem',
          PK_PASSWORD: 'eumc5115!'
        };
      }
    }
    else if(type == 'AUTH') {
      if(hsp_tp == CommonCodeConst.HIS_HSP_TP_CD_SEOUL){
        cert_info = {
          SITE_CD: 'A8EI7',
          CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/47OglRzANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA3MTAwNzA4MTNaFw0yODA3MDgwNzA4MTNaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNzEwMTAwMDUzOTYwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDMtfSQywg+z6SlMhuUDxFX7hPTc8mmqKLR3bn7JSO8NbiCDORtak5ievYScKPbethilWSSDPloWaR+54K65gPkZw461u9nx0q+UQmMKLS4TQE1XiNCWwUjYWI2WwBd+tAwZ40nGNmY+dGAoH1GiyNxv1n+8UJHNxBeLwvSiU37HNbwr1Cul+ya4c4etZdnIy6tRLObN3r+51SkKg4kJihTImCJsd3UNKdqb3yGb/qUw9QDHAaYeIV7Eu6ZvBUyQPXzUlLHI80MojX/+r6mHpGcPjDC+7BWolFIzGfxWSrKMz26JDjhFd1s293bSXmrA/BlEucX9bFa2maqq7cLobbxAgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQCeR8MzEvVsTwjAYUIHInMsP/WxKonEFTrm5IbYgFQIAjamJDgpS3Fs+SqE02hzqCORCggbMR4LWkFaUelDUaqSFGDVcZUMI+RClBdbz0Md9TE2UexDf+AdHsPKl1En3tFKIZG8kJ69Et92Abr4rtYawxyeV1F5+gYkJFzcoIdNY5ahJ+C+qMqRb69cyuitCXU6ByYIFddLpeyqxqtq/gYNFUi+BDeead7x3VbmgO8KnbLnDq2BmBqvkVSy7klpXf0OrvKMT09iwT8QPhGQIznKUftCWCXx7ymd1y1gkWgRFiUtzgdfK8N+RT8lA9WGwaGdGNzomXhKckgYd28X6DrD-----END CERTIFICATE-----',
          CERT_FILE_PATH: '/home/eumc/eumc-advanced-relay-server/cert/KCP_AUTH_A8EI7_PRIKEY.pem',
          PK_PASSWORD: 'eumceumc5115!'
        };
      }else{
        cert_info = {
          SITE_CD: 'A8B34',
          CERT_STR: '-----BEGIN CERTIFICATE-----MIIDFjCCAf6gAwIBAgIGAYiu00djMA0GCSqGSIb3DQEBCwUAMF8xCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEVMBMGA1UEBwwMRGVmYXVsdCBDaXR5MQwwCgYDVQQKDANLQ1AxGzAZBgNVBAMMEktDUCBQYXltZW50IEkvRiBDQTAeFw0yMzA2MTIwODU3NDFaFw0yNDA2MTIwODU3NDFaMDkxCzAJBgNVBAYTAktSMQwwCgYDVQQKDANLQ1AxHDAaBgNVBAMME0E4QjM0OzE2ODY1NjAyNjE5ODcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCZ7CYGp0+t2m/9XxuqtFlqnNAgmZ6+9Laqqf8O9NK66nunFpGn+AjG3tzXOW4nCDT3cSWu1Fujj3QTHrHHiXSg+q8XH/8/mqYFFMYAfQgmxPwYV0IRARgdfw+lUywIIvCr/VQuIKFa8Y/LMvdONi33wFhgbr2x/K8795CyTtOjr2kww4F7R5DmxgiXnFD47ZobUEIK3gzWiXG49uGYJgy5VRBYbmrELBs8iF3YK6Hz4leBSpdmwPXGr7O8apPqgi+yXFGieVIuck+h1rS/NNQarJzJmVKi+sZJbFFxVt6RaiHOjEA9EwWYQCHw7MGzH4csNkXzGIXFjGnODs6Gn2dpAgMBAAEwDQYJKoZIhvcNAQELBQADggEBANfWBB1I9g2x7fwEiYutif2uNrXYfo+btmRb11S9zV1Fk8sAi9+yxXhxYEjNhzpXzg526O5R2vONSenlQQdCGuN08XnHODR6vpGZGisvlJMcsDPh7tEzTUyGQz7d+u3eB09PDnTge4ibbUrDxBJp9KLcHrjxSOaMhXh6XonDmL1oFjSLs4BPg+PT6e06CIDMWajG6p5uLAQ3GFJ1QDWtHMyXeHhw/R7ZGazy/ZiJox2mue4dXCQqtZff3iZfz13TVs8CAJRpUQoq64I82ginur3jnxPZ36HffYtWiJ6qJySQ78SdDgCn9AbgXxJzekN68nZrY5uAT+kCtUwBeEH/S3c=-----END CERTIFICATE-----',
          CERT_FILE_PATH: '../../../cert/A8B34.pem',
          PK_PASSWORD: 'eumc5115!'
        };
      }
    }

    return cert_info;
  }

  getCertInfoBySiteCd(site_cd: string): KcpCertInfo{
    let cert_info = {
      SITE_CD: 'A52Q7',
      CERT_STR: this.KCP_CERT_INFO,
      CERT_FILE_PATH: '../../../cert/A8IE7.pem',
      PK_PASSWORD: 'vhTldlghk0!'
    } as KcpCertInfo;
    // 제증명은 인증서 1개
    if(site_cd == 'A8IE7'){
      cert_info = {
        SITE_CD: 'A8IE7',
        CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/22mzrxDANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA2MjEwNjU2MTZaFw0yODA2MTkwNjU2MTZaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNjIxMTAwMDUzMDkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCTCVQlUVnx/DPS4dgUOs9S/2g4xG9pG89BzHbjcHgjlRyH3uSUqGoAmiPoarU1ZmOBg8XoVW+rV0KcG6cUR3GNUREaC8EcTA8+ISGdN0IgNhqXo4jsGggBrhElN87fcnPgryPK/SPdL0CBcLztSgePBsFoYM+OkobW28sPlYYrRYDQFV6mLc5LXPqybWNxUwRdcfPlOILzbYzAZU3d3M+W/qlB5neWRtEDrt9Pj7NlA49Wm6M53iIwvzZUJFW01wtwU6PfTUWVMt/guBc0Il9eqdsPtBzYgkMugKsQC+NqVPyX42DwVtOQ3ipUHaXKiBrB414tDJBVHQdPuyYO2aWTAgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQBO9jOR/TZG1Zn80d69/VIT4bOiforlQTsfol2S/x56dO5uZq8DNM08mc7XL2lSyaUo7BLP9/CxvAa+apmjGFP78s30eWhZW8IXNrIpCeRe/QTuoqszp2Vw+Ud9FAeC+hALsdKaz7p6yEFDbZWVkCWCR83MohZhJTO7PJ/1A6U1zbh49EWh9h0A9p9pS/strY+LomxEeARQ/oy0GG0pZoZVSDOwdPy6O5qTXTdvA6KEHVIEbwHvJrGwxVyaJMs3bDdscT8Vn5cZfZkaq6fs6K6Fn9/mtUeZ6JW9peenT2/wKRAVttLdJkzEMFfjl0oe5sGWGovglcXEFw/lRaKDRnAM-----END CERTIFICATE-----',
        CERT_FILE_PATH: '../../../cert/A8IE7.pem',
        PK_PASSWORD: 'vhTldlghk0!'
      };
    }else if(site_cd == 'A8DZL') {
      cert_info = {
        SITE_CD: 'A8DZL',
        CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/24GLMxjANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA2MjIwMTQ4MzRaFw0yODA2MjAwMTQ4MzRaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNjIyMTAwMDUzMTEwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDQItDC890H6k6VaORzosK5IcfHYV3X7aQr0O8oACklPttgzm+H6bY2eCIZoB+SrgHSw87RXNFSCSZbi1l3r5GeDNnJYxgUvJxnW1LCKSFtPQKoEmoy4XYZxsA6q7MTq+dQhgZOjdSFXHKgBXBV6I9Fn+vWIv4UmXQZ8X03pmZN7qxmKCSg3gJX8M9iXS4U5dntztQexhy3XJdBo0AuE9H+xd+whWfUyoHzCWb/vZ1DtcjR/BRvz1GyGmuXTXSYMaUV/Y85UISFeBOe/IEQ2ae69GfqW4IWY3W+z9nsRu5dzK1tv+VRICYZMMXhzXH0Nzx3u7/2E4x1VOTi8eD7hVR/AgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQBDp/phToFqQUjB1l+nV1O0F9mLCTcijEQ67m0DU0NgZcfNIjntr3UOQu2zi3x2NgZTLR6WsNdJhLxRgJjWSiTc7NZxsoSMoAKwsaQF60hsGpQ7qQLY98uBznj64BTCL6n7EZGDXnLipVxjcBUm5q6/IVRofyiDrEjTrG27nlA76inCRHZKMwmx21yAJRV0ew7EZpyTr0w02YG2FLAULQ/uFiuKznBTRksDkfCE+yWMHfYUeUbWs0Kw77z7R3/il1bS+sCTVIzD/awyRKLint2pbtI2ObBiVs2QT58EcYbl1Zcb95Xzh60aJcB6oRmrXh6IZTkly4Hh2gKUWiXuXCt/-----END CERTIFICATE-----',        CERT_FILE_PATH: '../../../cert/A8DZL.pem',
        PK_PASSWORD: 'eumc5115!'
      };
    }else if(site_cd == 'A8DZT'){
      cert_info = {
        SITE_CD: 'A8DZT',
        CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/24GLMyDANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA2MjIwMTUzNTBaFw0yODA2MjAwMTUzNTBaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNjIyMTAwMDUzMTMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCLtMX2W7nRRGjIK625FqVdbSK7cj7VBra7k/roY9VhK+q0GhcvX3hg+zqWCuyuu5/ScZi1dG7lopz9lt3XTwItBBmG/kwYgfGPWbbGkMAmQ30dEqN40uFYd1pr8ZIKYUO4EqAIRtHWm0Xa0qlNgTCB1G89lSOIpQMNqIiy+LRfoE965g/xgyX7u3F65vnNsw2s27JRlMtcR6koMDgdaz33idLn9hTbF3gWhL6MRELBnjwfrbxV/Clnk47EQDcm71+Mrvot2H/yw4picOVgtdQxwwSkCBGGKY8UNbvf2v4f4k0GsejfXFEK9V/SXgVgiH771+dgiBtm96tPgSGnFoODAgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQBLDDBjuaqCleIaDddXJHVRnvhi4A8RcJ7YN2Kllr/Bvw3LptzU4es/rXZgUSPuMvuzfmLEZiw6AIsXci3+BZcVz9Ifk1syXbIcWM80+4kWTZQOlBrOrBYj3D6e3PXtvzfVdcfJQwEtTtLxvNA/gEDiacJocBVWe8dC2cU3jyb6diGBCfAJRiPJ5osfYF+Bwwl69t9NCMKXd7guVjI0Xfkvd0WYNiJ1fJMe5nPYH6SACk00kVA8BOmf5Q5oOqh34A88Hy3cGGnGwfZzU7Aiob711+ngh28l2q34lhI76X3h3tN6iBZVD17RzEz6kcalW0S1P90KCzXyPjfpM6CFzI1o-----END CERTIFICATE-----',        CERT_FILE_PATH: '../../../cert/A8DZT.pem',
        PK_PASSWORD: 'eumc5115!'
      };
    }else if(site_cd == 'A8DZI') {
      cert_info = {
        SITE_CD: 'A8DZI',
        CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/24GLMxTANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA2MjIwMTQ0MDFaFw0yODA2MjAwMTQ0MDFaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNjIyMTAwMDUzMTAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCVAdYL6tBH5UAIt08tAKGPQkGeAaDI4K1V78lyGn2XrDE5kEVJ13SQKha0eAKzJlJ9p0RWpSu1DlinW7YI/K520maOSeWzeUjlYmcPJ93gNQoO2in2qzEFNDN5u9GXJe8MJQ98S0O3aUzCvZ5sb29kWzuKNfwFlDW1Z/2CRDixHhEAQSRg9LSrIcH3efbOtQog3US7jyYsRq4sTCtcsWST19DwXLW+UhWTEKe9cDuvtZOoagKf+S5edP+V0v3me4jAeio3sfPlUH63YStSwmoPOSYs2zCTlOn2lfknaL70JcOJdkrEruIMCbHTqHOnvf527RuVkJhKy2CHYdDw0vS/AgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQAWRLM1XJkwV0yx0S32SfQIF7XO9K+iHNrkTae0e6jq2vjtK5M6aeM4OGcHRzGLPyW+EjHZjVSwW8qRK04cg574tZWb50i8xln+Wm8BnAbmd1fcTLcFIfx46e3DZN00LsHxvekPu6fQDjmjSYW3EuFPs9QRYGd7hKl5ClEOoa7IsBezbDXsMB2T7kBsRpyfEvsuQGdaR+sZ2aYHBsjZ9hB7VI5TW73kJ0+nL5qiQPubEUFDvC20sDkwn5hR14apPgE9NAH+BE0YD9MuqQuTASt6Sy6DCzUBy7IN6BN98AQs4tyVxSb5i2nqTC1s/MjTBMpZH1QlKgp29vID+jDoVsje-----END CERTIFICATE-----',
        CERT_FILE_PATH: '../../../cert/A8DZI.pem',
        PK_PASSWORD: 'EUMCSE5821!'
      };
    }
    else if(site_cd == 'A8DZR'){
      cert_info = {
        SITE_CD: 'A8DZR',
        CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/24GLMxzANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA2MjIwMTUxMjRaFw0yODA2MjAwMTUxMjRaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNjIyMTAwMDUzMTIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCIUHRkifPpxvcMrCTUDaeaS/rhaJkp1h7/b5oiuYrExDTSJYzyuqEEMt9Syhku8eJFZvSVa7MO2WZmSvOWEvC86Mmq5b2KDpwp9TKdGrUXL8uiOYc+yNDLyfa/hVnYRdi5J2OR3WyqgzEBFZQECppeCEOu5SZCm7A8zgTBgc3SZNfmYFD3MlS/YcvnSDxdu/Ys6EcNVYhBuprGqoxw2zmYSKtlqey8/ZLfvtUau4/gmHDN1BJ0qA3vRXCv+KpxBZ4/PnkUrFiQB8Nw66M4u2Xtk49HULh0B8/wb8SOByA5uESvmjg3QD2aaX2nk4AiRzrwv+TqYmIi8zRkYdaD2sNBAgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQC8O6gRlHZTU7IdkbvYCYmaQlMfv3EJlXoGPE8PLUIGEIuR2Zv/SOZcjFloilSK8rDCKFzFnh9l6X6r6X7nJzwF2ss6ofUdJePBglKhUzBuXwx6kY5Nh7exYF0KR+2KDNnPSG1c3Q6hfXpUwv0ravVs2KqOx9GJbHzluMmItOXmWDApA7HIhlY9gb2mruBcU4AZW3vUjUHc99bX2nhYiq6SndOlutQyFt/K1BiskfvpFOC4gyPYkIZF1bGOBv1Ys6csqRE/4E0bzX3dlztcI2VLPBT18N+TaZY/2Khkmv2TEpKVyaNzemyJtvpiqczdeY70kQZw4PI71Q3HXecVCtP3-----END CERTIFICATE-----',
        CERT_FILE_PATH: '../../../cert/A8DZR.pem',
        PK_PASSWORD: 'eumc5115!'
      };
    }
    else if(site_cd == 'A8B34'){
      cert_info = {
        SITE_CD: 'A8B34',
        CERT_STR: '-----BEGIN CERTIFICATE-----MIIDFjCCAf6gAwIBAgIGAYiu00djMA0GCSqGSIb3DQEBCwUAMF8xCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEVMBMGA1UEBwwMRGVmYXVsdCBDaXR5MQwwCgYDVQQKDANLQ1AxGzAZBgNVBAMMEktDUCBQYXltZW50IEkvRiBDQTAeFw0yMzA2MTIwODU3NDFaFw0yNDA2MTIwODU3NDFaMDkxCzAJBgNVBAYTAktSMQwwCgYDVQQKDANLQ1AxHDAaBgNVBAMME0E4QjM0OzE2ODY1NjAyNjE5ODcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCZ7CYGp0+t2m/9XxuqtFlqnNAgmZ6+9Laqqf8O9NK66nunFpGn+AjG3tzXOW4nCDT3cSWu1Fujj3QTHrHHiXSg+q8XH/8/mqYFFMYAfQgmxPwYV0IRARgdfw+lUywIIvCr/VQuIKFa8Y/LMvdONi33wFhgbr2x/K8795CyTtOjr2kww4F7R5DmxgiXnFD47ZobUEIK3gzWiXG49uGYJgy5VRBYbmrELBs8iF3YK6Hz4leBSpdmwPXGr7O8apPqgi+yXFGieVIuck+h1rS/NNQarJzJmVKi+sZJbFFxVt6RaiHOjEA9EwWYQCHw7MGzH4csNkXzGIXFjGnODs6Gn2dpAgMBAAEwDQYJKoZIhvcNAQELBQADggEBANfWBB1I9g2x7fwEiYutif2uNrXYfo+btmRb11S9zV1Fk8sAi9+yxXhxYEjNhzpXzg526O5R2vONSenlQQdCGuN08XnHODR6vpGZGisvlJMcsDPh7tEzTUyGQz7d+u3eB09PDnTge4ibbUrDxBJp9KLcHrjxSOaMhXh6XonDmL1oFjSLs4BPg+PT6e06CIDMWajG6p5uLAQ3GFJ1QDWtHMyXeHhw/R7ZGazy/ZiJox2mue4dXCQqtZff3iZfz13TVs8CAJRpUQoq64I82ginur3jnxPZ36HffYtWiJ6qJySQ78SdDgCn9AbgXxJzekN68nZrY5uAT+kCtUwBeEH/S3c=-----END CERTIFICATE-----',
        CERT_FILE_PATH: '../../../cert/A8B34.pem',
        PK_PASSWORD: 'eumc5115!'
      };
    }
    // 본인인증 테스트
    else if(site_cd == 'AO0QE'){
      cert_info = {
        SITE_CD: 'AO0QE',
        CERT_STR: '-----BEGIN CERTIFICATE-----MIIDgTCCAmmgAwIBAgIHBy4lYNG7ojANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMTA2MjkwMDM0MzdaFw0yNjA2MjgwMDM0MzdaMHAxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTERMA8GA1UECgwITG9jYWxXZWIxETAPBgNVBAsMCERFVlBHV0VCMRkwFwYDVQQDDBAyMDIxMDYyOTEwMDAwMDI0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAppkVQkU4SwNTYbIUaNDVhu2w1uvG4qip0U7h9n90cLfKymIRKDiebLhLIVFctuhTmgY7tkE7yQTNkD+jXHYufQ/qj06ukwf1BtqUVru9mqa7ysU298B6l9v0Fv8h3ztTYvfHEBmpB6AoZDBChMEua7Or/L3C2vYtU/6lWLjBT1xwXVLvNN/7XpQokuWq0rnjSRThcXrDpWMbqYYUt/CL7YHosfBazAXLoN5JvTd1O9C3FPxLxwcIAI9H8SbWIQKhap7JeA/IUP1Vk4K/o3Yiytl6Aqh3U1egHfEdWNqwpaiHPuM/jsDkVzuS9FV4RCdcBEsRPnAWHz10w8CX7e7zdwIDAQABox0wGzAOBgNVHQ8BAf8EBAMCB4AwCQYDVR0TBAIwADANBgkqhkiG9w0BAQsFAAOCAQEAg9lYy+dM/8Dnz4COc+XIjEwr4FeC9ExnWaaxH6GlWjJbB94O2L26arrjT2hGl9jUzwd+BdvTGdNCpEjOz3KEq8yJhcu5mFxMskLnHNo1lg5qtydIID6eSgew3vm6d7b3O6pYd+NHdHQsuMw5S5z1m+0TbBQkb6A9RKE1md5/Yw+NymDy+c4NaKsbxepw+HtSOnma/R7TErQ/8qVioIthEpwbqyjgIoGzgOdEFsF9mfkt/5k6rR0WX8xzcro5XSB3T+oecMS54j0+nHyoS96/llRLqFDBUfWn5Cay7pJNWXCnw4jIiBsTBa3q95RVRyMEcDgPwugMXPXGBwNoMOOpuQ==-----END CERTIFICATE-----',
        CERT_FILE_PATH: '/home/eumc/eumc-advanced-relay-server/cert/splPrikeyPKCS8.pem',
        PK_PASSWORD: 'changeit'
      };
    }
    //본인인증 라이브
    else if(site_cd == 'A8EI7'){
      cert_info = {
        SITE_CD: 'A8EI7',
        CERT_STR: '-----BEGIN CERTIFICATE-----MIIDjDCCAnSgAwIBAgIHBy/47OglRzANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMzA3MTAwNzA4MTNaFw0yODA3MDgwNzA4MTNaMHsxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTEWMBQGA1UECgwNTkhOIEtDUCBDb3JwLjEXMBUGA1UECwwOUEdXRUJERVYgVGVhbS4xGTAXBgNVBAMMEDIwMjMwNzEwMTAwMDUzOTYwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDMtfSQywg+z6SlMhuUDxFX7hPTc8mmqKLR3bn7JSO8NbiCDORtak5ievYScKPbethilWSSDPloWaR+54K65gPkZw461u9nx0q+UQmMKLS4TQE1XiNCWwUjYWI2WwBd+tAwZ40nGNmY+dGAoH1GiyNxv1n+8UJHNxBeLwvSiU37HNbwr1Cul+ya4c4etZdnIy6tRLObN3r+51SkKg4kJihTImCJsd3UNKdqb3yGb/qUw9QDHAaYeIV7Eu6ZvBUyQPXzUlLHI80MojX/+r6mHpGcPjDC+7BWolFIzGfxWSrKMz26JDjhFd1s293bSXmrA/BlEucX9bFa2maqq7cLobbxAgMBAAGjHTAbMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQCeR8MzEvVsTwjAYUIHInMsP/WxKonEFTrm5IbYgFQIAjamJDgpS3Fs+SqE02hzqCORCggbMR4LWkFaUelDUaqSFGDVcZUMI+RClBdbz0Md9TE2UexDf+AdHsPKl1En3tFKIZG8kJ69Et92Abr4rtYawxyeV1F5+gYkJFzcoIdNY5ahJ+C+qMqRb69cyuitCXU6ByYIFddLpeyqxqtq/gYNFUi+BDeead7x3VbmgO8KnbLnDq2BmBqvkVSy7klpXf0OrvKMT09iwT8QPhGQIznKUftCWCXx7ymd1y1gkWgRFiUtzgdfK8N+RT8lA9WGwaGdGNzomXhKckgYd28X6DrD-----END CERTIFICATE-----',
        CERT_FILE_PATH: '/home/eumc/eumc-advanced-relay-server/cert/KCP_AUTH_A8EI7_PRIKEY.pem',
        PK_PASSWORD: 'eumceumc5115!'
      };
    }
    // 본인인증 테스트-HUB
    else if(site_cd == 'S6186'){
      cert_info = {
        SITE_CD: 'S6186',
        CERT_STR: '-----BEGIN CERTIFICATE-----MIIDgTCCAmmgAwIBAgIHBy4lYNG7ojANBgkqhkiG9w0BAQsFADBzMQswCQYDVQQGEwJLUjEOMAwGA1UECAwFU2VvdWwxEDAOBgNVBAcMB0d1cm8tZ3UxFTATBgNVBAoMDE5ITktDUCBDb3JwLjETMBEGA1UECwwKSVQgQ2VudGVyLjEWMBQGA1UEAwwNc3BsLmtjcC5jby5rcjAeFw0yMTA2MjkwMDM0MzdaFw0yNjA2MjgwMDM0MzdaMHAxCzAJBgNVBAYTAktSMQ4wDAYDVQQIDAVTZW91bDEQMA4GA1UEBwwHR3Vyby1ndTERMA8GA1UECgwITG9jYWxXZWIxETAPBgNVBAsMCERFVlBHV0VCMRkwFwYDVQQDDBAyMDIxMDYyOTEwMDAwMDI0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAppkVQkU4SwNTYbIUaNDVhu2w1uvG4qip0U7h9n90cLfKymIRKDiebLhLIVFctuhTmgY7tkE7yQTNkD+jXHYufQ/qj06ukwf1BtqUVru9mqa7ysU298B6l9v0Fv8h3ztTYvfHEBmpB6AoZDBChMEua7Or/L3C2vYtU/6lWLjBT1xwXVLvNN/7XpQokuWq0rnjSRThcXrDpWMbqYYUt/CL7YHosfBazAXLoN5JvTd1O9C3FPxLxwcIAI9H8SbWIQKhap7JeA/IUP1Vk4K/o3Yiytl6Aqh3U1egHfEdWNqwpaiHPuM/jsDkVzuS9FV4RCdcBEsRPnAWHz10w8CX7e7zdwIDAQABox0wGzAOBgNVHQ8BAf8EBAMCB4AwCQYDVR0TBAIwADANBgkqhkiG9w0BAQsFAAOCAQEAg9lYy+dM/8Dnz4COc+XIjEwr4FeC9ExnWaaxH6GlWjJbB94O2L26arrjT2hGl9jUzwd+BdvTGdNCpEjOz3KEq8yJhcu5mFxMskLnHNo1lg5qtydIID6eSgew3vm6d7b3O6pYd+NHdHQsuMw5S5z1m+0TbBQkb6A9RKE1md5/Yw+NymDy+c4NaKsbxepw+HtSOnma/R7TErQ/8qVioIthEpwbqyjgIoGzgOdEFsF9mfkt/5k6rR0WX8xzcro5XSB3T+oecMS54j0+nHyoS96/llRLqFDBUfWn5Cay7pJNWXCnw4jIiBsTBa3q95RVRyMEcDgPwugMXPXGBwNoMOOpuQ==-----END CERTIFICATE-----',
        CERT_FILE_PATH: '/home/eumc/eumc-advanced-relay-server/cert/splPrikeyPKCS8.pem',
        PK_PASSWORD: 'changeit'
      };
    }




    return cert_info;
  }

  constructor(
    private httpService: HttpService,
    private cryUtil: CrytoUtil,
    private configService: ConfigService,
    private paymentApiService: PaymentApiService,
    private certApiService : CertApiService,
    @InjectRepository(EumcPayEumcEntity, "eumc_pay")
    private payEumcEntityRepo: Repository<EumcPayEumcEntity>,
    @InjectRepository(EumcKakaopayEumcEntity, "eumc_pay")
    private kakaopayEumcEntityRepo: Repository<EumcKakaopayEumcEntity>,
  ) {
  }


  getCurrentDate() {
    var date = new Date();
    var str_year = date.getFullYear().toString();
    var year = str_year.substr(2,4);

    var month: string = (date.getMonth() + 1).toString();
    month = Number(month) < 10 ? '0' + month.toString() : month.toString();

    var day = (date.getDate()).toString();
    day = Number(day) < 10 ? '0' + day.toString() : day.toString();

    var hour = date.getHours().toString();
    hour = Number(hour) < 10 ? '0' + hour.toString() : hour.toString();

    var minites: string = date.getMinutes().toString();
    minites = Number(minites) < 10 ? '0' + minites.toString() : minites.toString();

    var seconds = date.getSeconds().toString();
    seconds = Number(seconds) < 10 ? '0' + seconds.toString() : seconds.toString();

    return year + month + day + hour + minites + seconds;
  }





  // 거래등록 - 테스트
  async authHash(body) {
    body.site_cd = 'A8EI7';
    body.ct_type = 'HAS';
    body.make_req_dt = this.getCurrentDate();
    body.ordr_idxx = this.getOrderId() + 'EUMC';

    body.web_siteid = 'J19021203192';
    body.web_siteid_hashYN = 'Y';

    this.logger.debug(`REQ : ${JSON.stringify(body)}`);

    const hash_data = body.site_cd + "^" + body.ct_type + "^"
      + '000000' + "^" + body.make_req_dt; //up_hash 생성 서명 데이터
    const kcp_sign_data = this.make_sign_data(this.getCertInfoBySiteCd(body.site_cd), hash_data);


    // 거래등록 API REQ DATA
    var req_data = {
      site_cd : this.f_get_parm(body.site_cd),
      ct_type : this.f_get_parm(body.ct_type),
      ordr_idxx : this.f_get_parm(body.ordr_idxx),
      web_siteid : this.f_get_parm(body.web_siteid),
      tax_no: '000000',
      make_req_dt : this.f_get_parm(body.make_req_dt),
      web_siteid_hashYN : this.f_get_parm(body.web_siteid_hashYN),
      kcp_cert_info : this.getCertInfoBySiteCd(body.site_cd).CERT_STR,
      kcp_sign_data: kcp_sign_data,
    };

    this.logger.debug('tradeReg REQ: ' + JSON.stringify(req_data));
    // 본인인증 up_hash 생성 API URL
    // 개발 : https://stg-spl.kcp.co.kr/std/certpass
    // 운영 : https://spl.kcp.co.kr/std/certpass
    // return await fetch(this.configService.get<string>('PAY_COMMON_URL'), {
    return await fetch('https://spl.kcp.co.kr/std/certpass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_data),
    })
      // 본인인증 해시 API RES
      .then(async response =>  {
        let res = await response.json();
        this.logger.debug(`authHash RESP : ${JSON.stringify(res)}`)
        return {
          data: res,
          site_cd: body.site_cd,
          ordr_idxx: body.ordr_idxx,
          web_siteid: body.web_siteid,
          web_siteid_hashYN: body.web_siteid_hashYN,
          up_hash: res.up_hash
        };
      })
      .catch(err=>{
        this.logger.error(err);
      })
  }



  async authCertRes(body) {
    var target_URL = "https://spl.kcp.co.kr/std/certpass"; //개발계
    //var target_URL = "https://spl.kcp.co.kr/std/certpass"; // 운영계
    body.site_cd = 'A8EI7';

    var site_cd = body.site_cd;
    var cert_no = body.cert_no;
    var dn_hash = body.dn_hash;
    var ct_type = "CHK";
    var sbParam = body;


    var dnhash_data = site_cd + "^" + ct_type + "^" + cert_no + "^" + dn_hash; //dn_hash 검증 서명 데이터

    this.logger.debug('authCertRes dnhash_data: ' + dnhash_data);

    var kcp_sign_data = this.make_sign_data(this.getCertInfoBySiteCd(body.site_cd), dnhash_data); //서명 데이터(무결성 검증)



    var req_data = {
      kcp_cert_info: this.getCertInfoBySiteCd(body.site_cd).CERT_STR,
      site_cd: site_cd,
      ordr_idxx: body.ordr_idxx,
      cert_no: cert_no,
      dn_hash: dn_hash,
      ct_type: ct_type,
      kcp_sign_data: kcp_sign_data
    }

    this.logger.debug('authCertRes REQ: ' + JSON.stringify(req_data));
    // 본인인증 API URL
    // 개발 : https://stg-spl.kcp.co.kr/std/certpass
    // 운영 : https://spl.kcp.co.kr/std/certpass
    return await fetch(target_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_data),
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        var dn_res_cd = data.res_cd

        ct_type = "DEC";



        var decrypt_data = site_cd + "^" + ct_type + "^" + cert_no; //데이터 복호화 검증 서명 데이터
        kcp_sign_data = this.make_sign_data(this.getCertInfoBySiteCd(body.site_cd), decrypt_data); //서명 데이터(무결성 검증)

        let req_data = {
          kcp_cert_info: this.getCertInfoBySiteCd(body.site_cd).CERT_STR,
          site_cd: site_cd,
          ordr_idxx: body.ordr_idxx,
          cert_no: cert_no,
          ct_type: ct_type,
          enc_cert_Data: body.enc_cert_data2,
          kcp_sign_data: kcp_sign_data
        }

        this.logger.debug(`authCertRes RESP : ${JSON.stringify(data)}`);
        this.logger.debug(`authCertRes DEC REQ : ${JSON.stringify(req_data)}`);

        //dn _hash 검증데이터가 정상일 때, 복호화 요청 함
        if (dn_res_cd === "0000") {
          return await fetch(target_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req_data),
          })
            // API RES
            .then(response => {
              return response.json();
            })
            .then(data => {
              const enc_res_msg = sbParam.res_msg;
              const dec_res_msg = enc_res_msg;

              const enc_user_name = sbParam.user_name;
              const dec_user_name = enc_user_name;

              sbParam.res_msg = dec_res_msg;
              sbParam.user_name = dec_user_name;

              this.logger.debug(`authCertRes DEC RESP : ${JSON.stringify(data)}`);


              return {
                data: data,
                sbParam: sbParam
              };
            });
        } else {
          console.log("dn_hash 변조 위험있음") //dn_hash 검증에 실패했을 때, console 출력
        }
      });
  }



  // 거래등록 - 테스트
  async regKcpTrade(body) {

    // body.site_cd = 'A52Q7';

    // 거래등록 API REQ DATA
    var req_data = {
      site_cd : this.f_get_parm(body.site_cd),
      kcp_cert_info : this.getCertInfoBySiteCd(body.site_cd).CERT_STR,
      ordr_idxx : this.f_get_parm(body.ordr_idxx),
      good_mny : this.f_get_parm(body.good_mny),
      good_name : this.f_get_parm(body.good_name),
      pay_method : this.f_get_parm(body.pay_method),
      Ret_URL : this.f_get_parm(body.Ret_URL),
      escw_used : 'N',
      user_agent : ''
    };

  this.logger.debug('tradeReg REQ: ' + JSON.stringify(req_data));
    // 거래등록 API URL
    // 개발 : https://stg-spl.kcp.co.kr/std/tradeReg/register
    // 운영 : https://spl.kcp.co.kr/std/tradeReg/register
    // return await fetch(this.configService.get<string>('PAY_COMMON_URL'), {
    return await fetch('https://spl.kcp.co.kr/std/tradeReg/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(req_data),
      })
      // 거래등록 API RES
      .then(async response =>  {
        let res = await response.json();
        this.logger.debug(`tradeReg RESP : ${JSON.stringify(res)}`)
        return res;
      })
      .catch(err=>{
        this.logger.error(err);
      })
  }


  /**
   * 배치키 발급 요청
   * @param body
   */
  async reqKcpBatch(body) {
    // 배치키 발급 API REQ DATA
    var req_data = {
      site_cd : this.f_get_parm(body.site_cd),
      kcp_cert_info : this.getCertInfoBySiteCd(body.site_cd).CERT_STR,
      tran_cd : this.f_get_parm(body.tran_cd),
      enc_data : this.f_get_parm(body.enc_data),
      enc_info : this.f_get_parm(body.enc_info),
    };

    // 배치키 발급 API URL
    // 개발 : https://stg-spl.kcp.co.kr/gw/enc/v1/payment
    // 운영 : https://spl.kcp.co.kr/gw/enc/v1/payment
    return await fetch(this.configService.get<string>('PAY_SMART_KEY_RETURN_URL'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_data),
    })
      // 배치키 발급 API RES
      .then(response => {
        return response.json();
      })
      .then(async data => {
        this.logger.debug(`BATCH KEY RESP : ${JSON.stringify(data)}`)
        this.logger.debug(`REQ BATCH : ${JSON.stringify(body)}`)
        // "param_opt_1":"병원코드",
        // "param_opt_2":"환자번호",
        // "param_opt_3":"카드닉네임",
        if (data.res_cd == '0000') {
        const db_resp = await this.saveKcpBatchKey({
          batch_key: data.batch_key,
          card_name: body.param_opt_3 || data.card_name + '|' + body.card_mask_no.split('******')[1],
          userKey: body.card_mask_no,
          his_hsp_tp_cd: body.param_opt_1,
          patNo: body.param_opt_2,
        });
            this.logger.debug(`DB RESP : ${db_resp}`);
            return db_resp;
         } else {
           throw data.res_msg;
         }
      });
  }


  async getKcpPayList(his_hsp_tp_cd: string, pat_no: string) {
    const list = await this.payEumcEntityRepo.find({
      where:{
        his_hsp_tp_cd: his_hsp_tp_cd,
        patno: pat_no,
        delyn: Not('Y')
      }

    });
    return list;
  }

  /**
   * 배치키 정보 저장
   * @param body
   */
  async saveKcpBatchKey(body) {
    /**
     *  {"res_msg":"정상처리",
     *  "card_cd":"CCDI",
     *  "card_bin_type_02":"0",
     *  "card_bank_cd":"0321",
     *  "batch_key":"2304051168518034",
     *  "card_name":"현대카드",
     *  "van_tx_id":"",
     *  "card_bin_type_01":"0",
     *  "res_cd":"0000",
     *  "join_cd":""}
     */
    var save_data = {
      batchkey: body.batch_key,
      cardname: body.card_name,

      password: '',
      userKey: body.userKey,
      his_hsp_tp_cd: body.his_hsp_tp_cd,
      patno: body.patNo,

      regdate: new Date(),
    } as EumcPayEumcEntity;

    const foundOne = await this.payEumcEntityRepo.findOne({
      where: {
        his_hsp_tp_cd: body.his_hsp_tp_cd,
        patno: body.patNo,
        userKey: body.userKey,
        delyn: 'N'
      }
    });

    this.logger.debug(`SAVE BATCH KEY DB : ${JSON.stringify(foundOne)}`)

    if(foundOne != null && foundOne.seq != null){
      // save_data.seq = foundOne.seq;
      // return await this.payEumcEntityRepo.save(save_data);
      throw "이미 등록된 카드가 있습니다.";
    }
    else{
      return await this.payEumcEntityRepo.save(save_data);
    }


  }


  /**
   * 배치키 정보 삭제
   * @param body
   */
  async deleteKcpBatchKey(seq) {
    this.logger.debug(`배치키 정보 삭제 START`);
    try{
      const foundOne = await this.payEumcEntityRepo.findOne({
        where: {
          seq: seq
        }
      });

      if(foundOne != null){
        foundOne.delyn = 'Y';
        foundOne.deldate = moment().format('yyyyMMDDHHmmss')
        return await this.payEumcEntityRepo.save(foundOne);
      }else{
        return 0;
      }
    }catch (e){
      this.logger.error(`배치키 정보 삭제 ERR : ${e}`);
      throw e;
    }
  }

  getOrderId = () => {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var month_str = '';
    var date = today.getDate();
    var time = '' + today.getHours() + '' + today.getMinutes();

    if (month < 10) {
      month_str = '0' + month;
    }

    var vOrderID = year + '' + month_str + '' + date + '' + time;
    return vOrderID;
  };

  async reqKcpAutoPay(body: ReqKcpPayment) {
    var site_cd = body.site_cd;
    var ordr_idxx = this.getOrderId();
    var reqKcpPayInfo = body;

    this.logger.debug(`REQ: ${JSON.stringify(reqKcpPayInfo)}`);

    /*
    OUT_PATIENT = '1', // 외래 진료비
  INOUT_MID = '2', // 입퇴원 중간비
  INOUT_FINAL = '3', // 퇴원비
  RSV_PAY = '4', // 진료예약 예약비
  HISTORY_TALK_PAY = '5', // 문진표 작성(스마트서베이)
  REQ_CERTIFICATION = '6', // 증명서 신청
  RSV_MEDICINE_PAY = '7', // 예약 조제비 결제
     */
    switch(body.rcp_type) {
      case RCP_TYPE.OUT_PATIENT:
        body.good_name = "외래수납";
        break;
      case RCP_TYPE.INOUT_MID:
        body.good_name = "입원중간비 수납";
        break;
      case RCP_TYPE.INOUT_FINAL:
        body.good_name = "퇴원비 수납";
        break;

      // case RCP_TYPE.RSV_PAY:
      // body.good_name = "진료예약 예약비"; break;
      // case RCP_TYPE.HISTORY_TALK_PAY:
      // body.good_name = "스마트서베이"; break;

      case RCP_TYPE.REQ_CERTIFICATION:
        body.good_name = "증명서 신청";
        break;
      case RCP_TYPE.RSV_MEDICINE_PAY:
        body.good_name = " 예약 조제비 결제";
        break;
    }

    // 결제 REQ DATA
    var req_data = {};

    req_data = {
      site_cd : site_cd,
      kcp_cert_info : this.getCertInfoBySiteCd(site_cd).CERT_STR,
      pay_method : "CARD",
      amount : body.good_mny,
      card_mny : body.good_mny,
      currency : "410", // 통화코드 한화
      quota : "00", // 할부개월
      ordr_idxx : ordr_idxx,
      good_name : body.good_name,
      buyr_name : body.buyr_name,
      buyr_mail : '',
      buyr_tel2 : '',
      card_tx_type : "11511000",
      bt_batch_key : body.bt_batch_key,
      bt_group_id : body.bt_group_id // 그룹아이디 BA0011000348 실제 A8B2Z1002682 PG A8DZR1002800
    };

    // 결제 API URL
    // 개발 : https://stg-spl.kcp.co.kr/gw/hub/v1/payment
    // 운영 : https://spl.kcp.co.kr/gw/hub/v1/payment
    return await fetch('https://spl.kcp.co.kr/gw/hub/v1/payment', {
      // return await fetch(this.configService.get<string>(`PAY_SMART_PAY_URL`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_data),
    })
      // 결제 API RES
      .then(response => {
        return response.json();
      })
      .then(data => {
        /*
        ==========================================================================
            승인 결과 DB 처리 실패시 : 자동취소
        --------------------------------------------------------------------------
            승인 결과를 DB 작업 하는 과정에서 정상적으로 승인된 건에 대해
        DB 작업을 실패하여 DB update 가 완료되지 않은 경우, 자동으로
            승인 취소 요청을 하는 프로세스가 구성되어 있습니다.

        DB 작업이 실패 한 경우, bSucc 라는 변수(String)의 값을 "false"
            로 설정해 주시기 바랍니다. (DB 작업 성공의 경우에는 "false" 이외의
            값을 설정하시면 됩니다.)
        --------------------------------------------------------------------------
        */
        var bSucc = ''; // DB 작업 실패 또는 금액 불일치의 경우 "false" 로 세팅
        // bSucc='false'인 경우 자동취소로직 진행
        if( bSucc == 'false' ) {
          req_data = {};
          // 취소 REQ DATA
          var tno = data.tno;
          var mod_type = 'STSC';
          var cancel_sign_data = site_cd + '^' + tno + '^' + mod_type;
          var kcp_sign_data = this.make_sign_data(this.getCertInfoBySiteCd(site_cd), cancel_sign_data);

          req_data = {
            site_cd : site_cd,
            tno : tno,
            kcp_cert_info : this.getCertInfoBySiteCd(site_cd).CERT_STR,
            kcp_sign_data : kcp_sign_data,
            mod_type : mod_type,
            mod_desc : '가맹점 DB 처리 실패(자동취소)'
          };
          // 취소 API URL
          // 개발 : https://stg-spl.kcp.co.kr/gw/mod/v1/cancel
          // 운영 : https:/spl.kcp.co.kr/gw/mod/v1/cancel
          return fetch(this.configService.get<string>(`PAY_CANCEL_URL`), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req_data),
          })
            // 취소 API RES
            .then(response => {
              return response.json();
            })
            // RES JSON DATA Parsing
            .then(data => {
              return data;
              // res.render('pay/kcp_api_pay', {
              //   req_data : JSON.stringify(req_data),
              //   res_data : JSON.stringify(data),
              //   data : data,
              //   bSucc : bSucc
              // });
            })
          // bSucc='false'가 아닌경우 자동취소로직 생략 후 결제결과처리
        } else {
          this.logger.debug(`SMART PAY SUCCESS : ${JSON.stringify(data)}`);

          //(data.res_cd)
          //{"order_no":"20230412329",
          // "mall_taxno":"1138521083",
          // "partcanc_yn":"Y",
          // "noinf":"N",
          // "res_msg":"정상처리",
          // "coupon_mny":"0",
          // "pg_txid":"0412032914MK28987373370000000011000070577311",
          // "card_bin_type_01":"0",
          // "trace_no":"A52Q7YM1N8ONLXDR",
          // "card_mny":"1100",
          // "res_vat_mny":"100",
          // "ca_order_id":"20230412329",
          // "res_tax_flag":"TG01",
          // "acqu_name":"신한카드",
          // "card_no":"461954******7815",
          // "quota":"00",
          // "van_cd":"VNKC",
          // "acqu_cd":"CCLG",
          // "amount":"1100",
          // "cert_no":"23732987373372",
          // "van_apptime":"20230412032914",
          // "use_point":"0",
          // "res_free_mny":"0",
          // "pay_method":"PACA",
          // "card_bin_bank_cd":"0301",
          // "bizx_numb":"0040905630",
          // "res_cd":"0000",
          // "escw_yn":"N",
          // "join_cd":"0000",
          // "app_time":"20230412032914",
          // "tno":"23732987373372",
          // "card_bin_type_02":"1",
          // "card_cd":"CCLG",
          // "res_en_msg":"processing completed",
          // "card_name":"신한카드",
          // "mcht_taxno":"1138521083",
          // "res_green_deposit_mny":"0",
          // "res_tax_mny":"1000",
          // "app_no":"70577311"}

          //TODO: 증명서에 대한 수납처리가 필요
          return this.savePaymentKcpDB(reqKcpPayInfo, reqKcpPayInfo.his_hsp_tp_cd, reqKcpPayInfo.pat_no, reqKcpPayInfo.rcp_type, data, reqKcpPayInfo.data_set);
        }
      });
  }


  async savePaymentKcpDB(req: ReqKcpPayment, his_hsp_tp_cd: string, pat_no: string, rcp_type: string, pay_resp: RespKcpPayment, data_set: any){
    if(rcp_type == RCP_TYPE.OUT_PATIENT) {

      let reqBody = new PaymentSave();
      reqBody.buyerCode = '778';// KCP : 778
      reqBody.in_hsp_tp_cd = his_hsp_tp_cd;
      reqBody.patno = pat_no
      reqBody.treatDate =  moment().format("yyyyMMDD");

      reqBody.approvedNo = pay_resp.tno;
      reqBody.creditPaidTime = pay_resp.app_time;
      reqBody.paidAmount = pay_resp.amount;
      reqBody.buyer = pay_resp.card_name;
      reqBody.catId = pay_resp.bizx_numb;
      reqBody.revolving = pay_resp.quota;

      if(typeof data_set == 'string'){
        this.logger.debug(`dataset = ${typeof data_set}`)
        data_set = JSON.parse(data_set + '');
      }

      // 환자정보
      reqBody.deptCode = data_set.deptCode;
      reqBody.medType = data_set.medType;
      reqBody.patType = data_set.patType;
      reqBody.drcode = data_set.drcode;
      reqBody.typeCd = data_set.typeCd;

      // REQ DATA
      // {"buyerCode":"778",
      //   "in_hsp_tp_cd":"01",
      //   "patno":"15747060",
      //   "treatDate":"20231019",
      //   "approvedNo":"23542357804508",
      //   "creditPaidTime":"20231019133645",
      //   "paidAmount":"800",
      //   "buyer":"신한카드",
      //   "catId":"0040905630",
      //   "revolving":"00",
      //   "deptCode":"CCIMG",
      //   "medType":"2",
      //   "patType":"BB",
      //   "drcode":"00289",
      //   "typeCd":"193",
      //   "creditCardNo":"4518420000004898"
      // },
      // // PAY DATA
      // {"order_no":"2023191336",
      //   "card_bin_length":"6",
      //   "mall_taxno":"3668200250",
      //   "partcanc_yn":"Y",
      //   "noinf":"N",
      //   "res_msg":"정상처리",
      //   "coupon_mny":"0",
      //   "pg_txid":"1019133645MK28357804500000000008000048253349",
      //   "card_bin_type_01":"0",
      //   "trace_no":"A8DZIXQPE9JQJPFB",
      //   "card_mny":"800",
      //   "res_vat_mny":"73",
      //   "ca_order_id":"2023191336",
      //   "res_tax_flag":"TG01",
      //   "acqu_name":"신한카드",
      //   "card_no":"4518420000004898",
      //   "quota":"00",
      //   "van_cd":"VNKC",
      //   "acqu_cd":"CCLG",
      //   "amount":"800",
      //   "cert_no":"23542357804508",
      //   "van_apptime":"20231019133645",
      //   "use_point":"0",
      //   "res_free_mny":"0",
      //   "pay_method":"PACA",
      //   "card_bin_bank_cd":"0301",
      //   "bizx_numb":"0040905630",
      //   "res_cd":"0000",
      //   "escw_yn":"N",
      //   "join_cd":"0000",
      //   "app_time":"20231019133645",
      //   "tno":"23542357804508",
      //   "card_bin_type_02":"0",
      //   "card_cd":"CCLG",
      //   "res_en_msg":"processing completed",
      //   "card_name":"신한카드",
      //   "mcht_taxno":"1138521083",
      //   "res_green_deposit_mny":"0",
      //   "res_tax_mny":"727",
      //   "app_no":"48253349"}

      reqBody.creditCardNo = pay_resp.card_no;
      this.logger.debug(`SAVE PAYMENT REQ : ${rcp_type}, ${pat_no}, ${JSON.stringify(reqBody)}, ${JSON.stringify(pay_resp)}`)


      // reqBody.
      // {"OUT_RCPSEQ2":"2","OUT_ROW":"1","OUT_PT_NO":"16388130","OUT_PATNAME":"박시온","OUT_MEDDEPT1":"FM","OUT_DEPTNAME1":"가정의학과",
      //   "OUT_MEDDR1":"01278","OUT_DRNAME1":"손여주","OUT_SPCDRYN1":"N","OUT_MEDYN1":"Y","OUT_MEDTYPE1":"2","OUT_PATTYPE1":"BB",
      //   "OUT_TYPECD1":"000","OUT_CUSTCD1":"","OUT_CUSTNAME1":"","OUT_INORDCD1":"","OUT_CUSTINF1":"",
      //   "OUT_RATEINF1":"1         25        50        50        20        50        50        50        B         30        50        50        ",
      //   "OUT_INSURT1":"2023-09-18                    99999      81347906541    박시온              960623-1590812      본인                20230918  099999               ",
      //   "OUT_RCPAMT1":"8900","OUT_CALTYN1":"N","OUT_INORD_YN1":"N","OUT_MEDDATE":"20231103","OUT_RPY_PACT_ID":"1013779485","OUT_RPY_CLS_SEQ":"1",
      //   "OUT_MEDR_SID":"1011384","OUT_HIPASS_YN":"N","IO_ERRYN":"","IO_ERRMSG":"","rrn":"9606231590812"}]
      // {"ordr_idxx":"2023113144916388130","site_cd":"A8DZL","good_name":"가정의학과","good_mny":"8900"


      if(typeof(data_set.raw) != 'undefined'){
        reqBody.rcpseq2 = data_set.raw.OUT_RCPSEQ2;
        reqBody.spcdrYn = data_set.raw.OUT_SPCDRYN1; //
        reqBody.insurt = data_set.raw.OUT_INSURT1; //
        reqBody.custCd = data_set.raw.OUT_CUSTCD1; //
        reqBody.custRate = data_set.raw.OUT_RATEINF1; //
        reqBody.custInfo = data_set.raw.OUT_CUSTINF1; //
      }
      // private String custcd;      // 계약처코드
      // private String custname;    // 계약처명
      // private String inordcd;     // 예외환자사유
      // private String custinf;     // 계약처정보
      // private String rateinf;     // 보험부담율정보
      // private String insurt;      // 보험정보

      const callResp = await this.paymentApiService.savePayment(rcp_type, pat_no, reqBody);
      this.logger.debug(`savePayment EMR RESP : ${callResp}`);

      try{
        let pdfReq = new ReqMakeCertPdf();
        pdfReq.his_hsp_tp_cd = his_hsp_tp_cd;
        pdfReq.patno = pat_no;
        pdfReq.rcptype = rcp_type;
        pdfReq.certname = '진료비계산영수증';
        pdfReq.deptname = data_set.deptCode;
        pdfReq.date = reqBody.treatDate.replace(/-/gi, '');;
        pdfReq.data = '';
        pdfReq.email = data_set.email;
        const pdfResp = await this.certApiService.getCertificationListSummary(pdfReq);
        this.logger.debug(`bill PDF RESP : ${pdfResp}`);
      }catch (e) {
        this.logger.error(e);
      }

    }
    else if(rcp_type == RCP_TYPE.INOUT_MID) {
      let reqBody = new PaymentSaveI();
      reqBody.buyerCode = '778';// KCP : 778
      reqBody.in_hsp_tp_cd = his_hsp_tp_cd;
      reqBody.patno = pat_no
      reqBody.treatDate =  moment().format("yyyyMMDD"),

      reqBody.approvedNo = pay_resp.tno;
      reqBody.creditPaidTime = pay_resp.app_time;
      reqBody.paidAmount = pay_resp.amount;
      reqBody.buyer = pay_resp.card_name;
      reqBody.catId = pay_resp.bizx_numb;
      reqBody.revolving = pay_resp.quota;
      reqBody.creditCardNo = pay_resp.card_no;

      // 환자정보
      reqBody.deptCode = data_set.deptCode;
      reqBody.patType = data_set.patType;
      reqBody.typeCd = data_set.typeCd;

      /**
       *  treatDate: string;
       *   typeCd: string;
       *   patType: string;
       *   creditPaidTime: string;
       *   patno: string;-
       *   paidAmount: string;-
       *   deptCode: string;
       *   approvedNo: string;-
       *   revolving: string; --
       *   buyerCode: string;-
       *   buyer: string;-
       *   catId: string;-
       */
      this.logger.debug(`SAVE PAYMENT REQ : ${rcp_type}, ${pat_no}, ${JSON.stringify(reqBody)}, ${JSON.stringify(pay_resp)}`)
      const callResp = await this.paymentApiService.savePaymentIB(rcp_type, reqBody);
      this.logger.debug(`savePayment EMR RESP : ${callResp}`);

      try{
        let pdfReq = new ReqMakeCertPdf();
        pdfReq.his_hsp_tp_cd = his_hsp_tp_cd;
        pdfReq.patno = pat_no;
        pdfReq.rcptype = rcp_type;
        pdfReq.certname = '진료비계산영수증';
        pdfReq.deptname = data_set.deptCode;
        pdfReq.date = reqBody.treatDate.replace(/-/gi, '');
        pdfReq.data = '';
        pdfReq.email = data_set.email;
        const pdfResp = await this.certApiService.getCertificationListSummary(pdfReq);
        this.logger.debug(`bill PDF RESP : ${pdfResp}`);
      }catch (e) {
        this.logger.error(e);
      }
    }
    else if(rcp_type == RCP_TYPE.REQ_CERTIFICATION){
      // this.logger.debug(`CERTIFICATION : ${JSON.stringify(data_set)}`);
      // let data_set_value = JSON.parse(data_set).targetData;
      // //this.logger.debug(`data_set_value : ${JSON.stringify(data_set_value)}`);
      // //this.logger.debug(`rcptype : ${data_set_value.rcptype}`);
      // let reqBody = new ReqMakeCertPdf();
      // reqBody.his_hsp_tp_cd = his_hsp_tp_cd;
      // reqBody.patno = pat_no;
      // reqBody.rcptype = data_set_value.rcptype;
      // reqBody.certname = data_set_value.certname;
      // reqBody.deptname = data_set_value.deptname;
      // reqBody.fromdate = data_set_value.fromdate;
      // reqBody.todate = data_set_value.todate;
      // reqBody.date = data_set_value.date;
      // reqBody.data = data_set_value.date;
      // reqBody.email = data_set_value.email;
      // const callResp = await this.certApiService.getCertificationListSummary(reqBody);
    }

    // 수납저장
    let newOne = {
      tid: pay_resp.tno,
      amount: pay_resp.amount,
      issuer_corp_code: '',
      issuer_corp: '',
      approved_at: '',
      approved_id: '',
      install_month: pay_resp.quota,
      interest_free_install: '',
      item_name: req.good_name,
      payment_method_type: 'KCP_SMART',
      patno: pat_no
    } as EumcKakaopayEumcEntity;
    this.logger.error(`kakaopayEumcEntityRepo : ${newOne}`);
    return this.kakaopayEumcEntityRepo.save(newOne);
    // pay_resp
    //{"order_no":"20230412329",
    // "mall_taxno":"1138521083",
    // "partcanc_yn":"Y",
    // "noinf":"N",
    // "res_msg":"정상처리",
    // "coupon_mny":"0",
    // "pg_txid":"0412032914MK28987373370000000011000070577311",
    // "card_bin_type_01":"0",
    // "trace_no":"A52Q7YM1N8ONLXDR",
    // "card_mny":"1100",
    // "res_vat_mny":"100",
    // "ca_order_id":"20230412329",
    // "res_tax_flag":"TG01",
    // "acqu_name":"신한카드",
    // "card_no":"461954******7815",
    // "quota":"00",
    // "van_cd":"VNKC",
    // "acqu_cd":"CCLG",
    // "amount":"1100",
    // "cert_no":"23732987373372",
    // "van_apptime":"20230412032914",
    // "use_point":"0",
    // "res_free_mny":"0",
    // "pay_method":"PACA",
    // "card_bin_bank_cd":"0301",
    // "bizx_numb":"0040905630",
    // "res_cd":"0000",
    // "escw_yn":"N",
    // "join_cd":"0000",
    // "app_time":"20230412032914",
    // "tno":"23732987373372",
    // "card_bin_type_02":"1",
    // "card_cd":"CCLG",
    // "res_en_msg":"processing completed",
    // "card_name":"신한카드",
    // "mcht_taxno":"1138521083",
    // "res_green_deposit_mny":"0",
    // "res_tax_mny":"1000",
    // "app_no":"70577311"}

    /*
    String buyerCode, String in_hsp_tp_cd, String patno, String treatDate, String deptCode, String spcdrYn, String medType, String drcode, String patType, String typeCd, String insurt, String custCd, String custRate, String custInfo, String inordCd, String rcpseq2
      PaymentSave paymentSave = new PaymentSave(
          "778",  // KCP : 778
          his_hsp_tp_cd, (String) session.getAttribute("patno"), (String) session.getAttribute("meddate"),
          (String) session.getAttribute("meddept"), (String) session.getAttribute("spcdryn"),
          (String) session.getAttribute("medtype"), (String) session.getAttribute("meddr"), (String) session.getAttribute("pattype"), (String) session.getAttribute("typecd"), (String) session.getAttribute("insurt"),
          (String) session.getAttribute("custcd"), (String) session.getAttribute("rateinf"), (String) session.getAttribute("custinf"), (String) session.getAttribute("inordcd"), "0"
  );
     */


    // paymentSave.setApprovedNo(tno);  // KCP 거래 고유 번호
    // paymentSave.setCreditPaidTime(app_time);
    // paymentSave.setRevolving(quota);
    // paymentSave.setPaidAmount(amount); // 승인 완료 금액
    // paymentSave.setBuyer(card_name);
    // paymentSave.setCatId(bizx_numb);



    /**
     *   in_hsp_tp_cd: string;    // 0 : 병원 구분 코드 (01:서울, 02:목동)
     *   patno: string;       // 2
     *   treatDate: string;   // 3 : 진료일자(YYYYMMDD)
     *   deptCode: string;    // 7 : 진료과코드
     *   spcdrYn: string;     // 10 : 지정구분
     *   medType: string;     // 11 : 초재진구분
     *   drcode: string;      // 12 : 의사코드
     *   patType: string;     // 13 : 급여종별
     *   typeCd: string;      // 14 : 유형보조
     *   insurt: string;
     *   custCd: string;      // 16 : 계약처코드
     *   custRate: string;
     *   custInfo: string;
     *   inordCd: string;     // 43 : 예외환자코드
     *   rcpseq2: string;     // 44 : 그룹영수증순번
     *   buyerCode: string;   // 63 : 카드종류 (VAN응답-'0'+카드타입2자리)
     *   creditCardNo: string;   // 64 : 카드번호 (Track2값 중 '=' 앞까지)
     *   approvedNo: string;   // 65 : 승인번호 (VAN 응답)
     *   creditPaidDate: string;  // 66 : 카드승인일시
     *   creditPaidTime: string;  // 66 : 카드승인일시 (YYYYMMDDHHNN)
     *   revolving: string;   // 67 : 카드할부개월수 (MM)
     *   availablePeriod: string; // 69 : 카드유효기간 (Track2값 중 '=' 뒤부터 4자리)
     *   paidAmount: string;  // 70 : 요청금액
     *   shipID: string;      // 71 : 카드가맹점 (VAN응답 - VAN구분2자리+가맹점번호16자리)
     *   buyer: string;       // 72 : 카드명 (VAN응답 - 12자리)
     *   catId: string;       //가맹점번호
     */
  }





  /**
   * 일반 결제 요청
   * @param body
   */
  async reqKcpNormal(body) {
    var req_data = {
      site_cd : this.f_get_parm(body.site_cd),
      kcp_cert_info : this.getCertInfoBySiteCd(body.site_cd).CERT_STR,
      tran_cd : this.f_get_parm(body.tran_cd),
      enc_data : this.f_get_parm(body.enc_data),
      enc_info : this.f_get_parm(body.enc_info),
      ordr_mony : this.f_get_parm(body.good_mny),
    };


    this.logger.debug(`TARGET DATA : ${decodeURIComponent(unescape(body.param_opt_3))}`)
    body.target_data = JSON.parse(decodeURIComponent(unescape(body.param_opt_3)));


    switch(body.target_data.rcptype) {
      case RCP_TYPE.OUT_PATIENT:
        body.good_name = "외래수납";
        break;
      case RCP_TYPE.INOUT_MID:
        body.good_name = "입원중간비 수납";
        break;
      case RCP_TYPE.INOUT_FINAL:
        body.good_name = "퇴원비 수납";
        break;

      // case RCP_TYPE.RSV_PAY:
      // body.good_name = "진료예약 예약비"; break;
      // case RCP_TYPE.HISTORY_TALK_PAY:
      // body.good_name = "스마트서베이"; break;

      case RCP_TYPE.REQ_CERTIFICATION:
        body.good_name = "증명서 신청";
        break;
      case RCP_TYPE.RSV_MEDICINE_PAY:
        body.good_name = " 예약 조제비 결제";
        break;
    }


    let target_data = body.target_data;

    let reqSave = {
      site_cd: body.site_cd,
      bt_group_id: body.kcp_group_id,
      good_name: body.good_name,
      his_hsp_tp_cd: body.param_opt_1,
      pat_no: body.param_opt_2,
      bt_batch_key: '',
      good_mny: body.good_mny,
      rcp_type: target_data.rcptype,
      buyr_name: body.buyr_name,
    } as ReqKcpPayment;

    // 배치키 발급 API URL
    // 개발 : https://stg-spl.kcp.co.kr/gw/enc/v1/payment
    // 운영 : https://spl.kcp.co.kr/gw/enc/v1/payment
    return await fetch("https://spl.kcp.co.kr/gw/enc/v1/payment", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_data),
    })
      .then(response => {
        return response.json();
      })
      .then(async data => {
        this.logger.debug(`NORMAL PAY KEY RESP : ${JSON.stringify(data)}`)
        this.logger.debug(`REQ NORMAL PAY : ${JSON.stringify(body)}`)

        switch(target_data.rcptype) {
          case RCP_TYPE.OUT_PATIENT:
            reqSave.good_name = "외래수납";
            break;
          case RCP_TYPE.INOUT_MID:
            reqSave.good_name = "입원중간비 수납";
            break;
          case RCP_TYPE.INOUT_FINAL:
            reqSave.good_name = "퇴원비 수납";
            break;

          // case RCP_TYPE.RSV_PAY:
          // body.good_name = "진료예약 예약비"; break;
          // case RCP_TYPE.HISTORY_TALK_PAY:
          // body.good_name = "스마트서베이"; break;

          case RCP_TYPE.REQ_CERTIFICATION:
            reqSave.good_name = "증명서 신청";
            break;
          case RCP_TYPE.RSV_MEDICINE_PAY:
            reqSave.good_name = " 예약 조제비 결제";
            break;
        }

        // deptCode: string;    // 7 : 진료과코드
        // medType: string;     // 11 : 초재진구분
        // drcode: string;      // 12 : 의사코드
        // patType: string;     // 13 : 급여종별
        // typeCd: string;      // 14 : 유형보조

        // reqSave.deptCode = data_set.deptCode;
        // reqSave.medType = data_set.medType;
        // reqSave.patType = data_set.patType;
        // reqSave.drcode = data_set.drcode;
        // reqSave.typeCd = data_set.typeCd;

        if(target_data.rcptype == RCP_TYPE.OUT_PATIENT || target_data.rcptype == RCP_TYPE.INOUT_MID) {
          await this.savePaymentKcpDB(reqSave, body.param_opt_1, body.param_opt_2, target_data.rcptype, data, target_data);
        }else if(target_data.rcptype == RCP_TYPE.REQ_CERTIFICATION) {

          const { data } = await lastValueFrom(
            this.httpService.post(`https://app.eumc.ac.kr/api/v1/cert/requestMakeCertPdf`, {
              his_hsp_tp_cd: target_data.selected.his_hsp_tp_cd,
              patno: body.param_opt_2,
              rcptype: target_data.rcptype,
              certname: target_data.selected.certname.trim().replace(/\s/g, ''),
              deptname: target_data.selected.deptname,
              fromdate: target_data.selected.fromdate,
              todate: target_data.selected.todate,
              date: '',
              data: target_data.selected.certname.trim() === '일반진단서[재발급]' ? target_data.selected.dummyData : '',
              email: target_data.target_email,
            }, {
              headers: {
                'Content-Type': 'application/json;charset=utf-8',
              }
            }).pipe(
              catchError((error: AxiosError) => {
                this.logger.error(error.response.data);
                throw error;
              }),
            ),
          ).finally(()=>{
            this.logger.debug(`KAKAO READY SEND`)
          });
        }

        return '성공';
      });
  }

  async reqKcpOtp(body: any) {
    var site_cd = body.site_cd;
    var web_siteid = "J19021203192";

    var KCP_CERT_INFO = this.getCertInfoBySiteCd(site_cd).CERT_STR;
    var comm_id = this.f_get_parm(body.comm_id);
    var cp_sms_msg = this.f_get_parm(body.cp_sms_msg);
    var cp_callback = this.f_get_parm(body.cp_callback);
    var per_cert_no = this.f_get_parm(body.per_cert_no);

    var req_data = {
      site_cd: site_cd,
      kcp_cert_info: KCP_CERT_INFO,
      pay_method: "CERT:PERSON",
      cust_ip: "",
      tx_type: "2200",
      kcp_web_yn: "N",
      per_cert_no: per_cert_no,
      comm_id: comm_id,
      cp_sms_msg: cp_sms_msg,
      cp_callback: cp_callback
    };

    this.logger.error(`EUMC 페이 자동 결제 reqKcpOtp : ${JSON.stringify(body)}`);

    // 개발 : https://stg-spl.kcp.co.kr/gw/hub/v1/cert #개발계
    // 운영 : https://spl.kcp.co.kr/gw/hub/v1/cert # 운영계
    return await fetch('https://spl.kcp.co.kr/gw/hub/v1/cert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_data),
    })
      .then(response => {
        this.logger.debug(`EUMC 페이 자동 결제 resp : ${JSON.stringify(response)}`);
        return response.json();
      })
      .then(data => {
        return {
          req_data : JSON.stringify(req_data),
          res_data : JSON.stringify(data),
          cp_sms_msg : cp_sms_msg,
          cp_callback : cp_callback,
          data : data
        }
      })
      .catch(err=>{
        this.logger.error(`EUMC 페이 자동 결제 err : ${JSON.stringify(err)}`);
        throw err;
      })
      ;
  }

  async reqKcpAuthStart(body: any){
    body.site_cd = 'A8EI7';//'S6186';

    var site_cd = body.site_cd;
    var web_siteid = "J19021203192";
    var ordr_idxx = this.getOrderId();

    // var ordr_idxx = this.f_get_parm(body.ordr_idxx);
    var media_type = this.f_get_parm(body.media_type);
    var user_name = this.f_get_parm(body.user_name);
    var phone_no = this.f_get_parm(body.phone_no);
    var comm_id = this.f_get_parm(body.comm_id);
    var birth_day = this.f_get_parm(body.birth_day);
    var sex_code = this.f_get_parm(body.sex_code);
    var local_code = this.f_get_parm(body.local_code);
    var cp_sms_msg = this.f_get_parm(body.cp_sms_msg);
    var cp_callback = this.f_get_parm(body.cp_callback);
    var per_cert_no = this.f_get_parm(body.per_cert_no);
    // var cert_target_data = phone_no + "^" + user_name;// 간편인증
    var cert_target_data = phone_no + "^" + birth_day + "^" + user_name + "^" + local_code + "^" + sex_code;//일반인증
    var kcp_sign_data = this.make_sign_data(this.getCertInfoBySiteCd(site_cd), cert_target_data); //서명 데이터(무결성 검증)

    var req_data = {
      site_cd: site_cd,
      kcp_cert_info : this.getCertInfoBySiteCd(site_cd).CERT_STR,
      pay_method: "CERT:PERSON",
      media_type: media_type,
      cust_ip: "",
      ordr_idxx: ordr_idxx,
      tx_type: "2100", // 2200: 점유인증
      kcp_web_yn: "N",
      cert_type: "01",
      per_cert_no: per_cert_no,
      phone_no: phone_no,
      comm_id: comm_id,
      user_name: user_name,
      web_siteid: web_siteid,
      birth_day: birth_day,
      local_code: local_code,
      sex_code: sex_code,
      cp_sms_msg: cp_sms_msg,
      cp_callback: cp_callback,
      kcp_sign_data: kcp_sign_data
    };

    this.logger.error(`EUMC 페이 자동 결제 reqKcpAuthStart : ${JSON.stringify(req_data)}`);


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
    // 개발 : https://stg-spl.kcp.co.kr/gw/hub/v1/cert #개발계
    // 운영 : https://spl.kcp.co.kr/gw/hub/v1/cert # 운영계
    return await fetch('https://spl.kcp.co.kr/gw/hub/v1/cert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_data),
    })
      .then(response => {
        this.logger.error(`EUMC 페이 자동 결제 reqKcpAuthStart2 :`);
        return response.json();
      })
      .then(async data => {
        this.logger.error(`EUMC 페이 자동 결제 reqKcpAuthStart3 : ${JSON.stringify(data)}`);

        await this.reqKcpOtp({
          site_cd: req_data.site_cd,
          comm_id: req_data.comm_id,
          cp_sms_msg: req_data.cp_sms_msg,
          cp_callback: req_data.cp_callback,
          per_cert_no: data.per_cert_no
        });

        // return this.reqKcpAuthCi(data);
        return {
          req_data : JSON.stringify(req_data),
          res_data : JSON.stringify(data),
          cp_callback,
          cp_sms_msg,
          data : data
        }
      })
      ;
  }


  async reqKcpAuthProcess(body: any) {
    // 번호만 재생성
    if(body.per_cert_no != null && body.per_cert_no != ''){
      return this.reqKcpOtp(body);
    }else{
      return this.reqKcpAuthStart(body);
    }
  }



  async reqKcpOtpConfirm(body: ReqKcpOtpConfirm) {
    var site_cd = body.site_cd;

    var KCP_CERT_INFO = this.getCertInfoBySiteCd(site_cd).CERT_STR;
    var comm_id = this.f_get_parm(body.comm_id);
    var per_cert_no = this.f_get_parm(body.per_cert_no);
    var otp_no = this.f_get_parm(body.otp_no);
    var adl_agree_yn = this.f_get_parm(body.adl_agree_yn);

    var req_data = {
      site_cd: site_cd,
      kcp_cert_info: KCP_CERT_INFO,
      pay_method: "CERT:PERSON",
      cust_ip: "",
      tx_type: "2300",
      kcp_web_yn: "N",
      per_cert_no: per_cert_no,
      comm_id: comm_id,
      otp_no: otp_no,
      adl_agree_yn: adl_agree_yn
    };
    this.logger.error(`EUMC 본인인증확인 reqKcpAuthStart2 : ${JSON.stringify(req_data)}`);


    // 개발 : https://stg-spl.kcp.co.kr/gw/hub/v1/cert #개발계
    // 운영 : https://spl.kcp.co.kr/gw/hub/v1/cert # 운영계
    return await fetch('https://spl.kcp.co.kr/gw/hub/v1/cert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_data),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.logger.error(`EUMC 본인인증확인 reqKcpAuthStart3 : ${JSON.stringify(data)}`);
        //res_cd, res_msg
        if(data.res_cd == '0000'){
          return {
            req_data : JSON.stringify(req_data),
            res_data : JSON.stringify(data),
            data : data
          }
        }else{
          throw data.res_msg;
        }
      });
  }


  async reqKcpAuthConfirm(body: any) {
    var site_cd = body.site_cd;

    var KCP_CERT_INFO = this.getCertInfoBySiteCd(site_cd).CERT_STR;
    var comm_id = this.f_get_parm(body.comm_id);
    var per_cert_no = this.f_get_parm(body.per_cert_no);
    var auth_tx_id = this.f_get_parm(body.auth_tx_id);

    var req_data = {};

    if( comm_id == "SKT" || comm_id == "SKM")
    {
      req_data = {
        site_cd: site_cd,
        kcp_cert_info: KCP_CERT_INFO,
        pay_method: "CERT:PERSON",
        cust_ip: "",
        tx_type: "2600",
        kcp_web_yn: "N",
        per_cert_no: per_cert_no,
        comm_id: comm_id,
        auth_tx_id : auth_tx_id
      }
    }

    else
    {
      req_data = {
        site_cd: site_cd,
        kcp_cert_info: KCP_CERT_INFO,
        pay_method: "CERT:PERSON",
        cust_ip: "",
        tx_type: "2600",
        kcp_web_yn: "N",
        per_cert_no: per_cert_no,
        comm_id: comm_id
      }
    }

    // 개발 : https://stg-spl.kcp.co.kr/gw/hub/v1/cert #개발계
    // 운영 : https://spl.kcp.co.kr/gw/hub/v1/cert # 운영계
    return await fetch('https://spl.kcp.co.kr/gw/hub/v1/cert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req_data),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.logger.error(`EUMC 본인인증확인 reqKcpAuthConfirm : ${JSON.stringify(data)}`);
        return {
          req_data : JSON.stringify(req_data),
          res_data : JSON.stringify(data),
          data : data
        }
      });
  }


// null 값 처리
  f_get_parm(val) {
    if ( val == null ) val = '';
    return val;
  }

// 서명데이터 생성 예제
  make_sign_data(cert: KcpCertInfo, data){
    this.logger.debug(`make_sign_data cert : ${JSON.stringify(cert)}`);
    this.logger.debug(`make_sign_data data : ${data}`);

    // 개인키 READ
    // "splPrikeyPKCS8.pem" 은 테스트용 개인키
    // "changeit" 은 테스트용 개인키비밀번호
    var key_file = fs.readFileSync(cert.CERT_FILE_PATH);
    var password = cert.PK_PASSWORD;

    this.logger.debug(`make_sign_data cert : ${JSON.stringify(cert)}`);

    // 서명데이터생성
    return crypto.createSign('sha256').update(data).sign({
      format: 'pem',
      key: key_file,
      passphrase: password
    }, 'base64');
  }




}
