import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ReqMakePdfDto } from "../dto/req-make-pdf.dto";
import { CommonCodeConst, PDF_GEN_API_TYPE } from "../../const/common-code.const";
import { catchError, firstValueFrom } from "rxjs";
import qs from "qs";
import { AxiosError } from "axios";
import * as fs from "fs";

@Injectable()
export class PdfGenerateService {
  private readonly logger = new Logger(PdfGenerateService.name);

  private readonly  dir = CommonCodeConst.CERT_PDF_FILE_PATH + '/';
  private readonly  viewDir = "src/common/services/pdf-templates/";

  constructor(private httpService: HttpService) {
  }

  date_to_str(date, format){
    var y = date.substring(0, 4);
    var m = date.substring(4, 6);
    var d = date.substring(6, 8);

    return y + format + m + format + d;
  }

  numberWithCommas(x) {
    if (x === 0) {
      return 0;
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
  }

  editCommaAndZero(x) {
    if (x == "0" || x == 0) {
      return "";
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async reqMakePdf(url: string, body: any) {
    // parameters.add("fileCode", fileCode);
    // parameters.add("fileName", fileName);
    // parameters.add("pdfInfo", String.valueOf(json));
    const { data } = await firstValueFrom(
      this.httpService.post(url, body).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw error;
        }),
      ),
    );
    return data;
  }


  async reqMakeCertPdf(type: PDF_GEN_API_TYPE, body: ReqMakePdfDto) {
    let result;
    try{
      switch (type) {
        case PDF_GEN_API_TYPE.JINDAN:
          result = await this.generateJindanPDF(body);
          break;
        case PDF_GEN_API_TYPE.SOGYEONSEO:
          result = await this.generateSogyeonseoPDF(body);
          break;
        case PDF_GEN_API_TYPE.IN_OUT_CERT:
          result = await this.ibtoewonsasilhwaginseoPDF(body);
          break;
        case PDF_GEN_API_TYPE.TONGWON_CERT:
          result = await this.tongwonjinryoPDF(body);
          break;
        case PDF_GEN_API_TYPE.MEDICAL_PAY_CERT:
          result = await this.jinlyobinabibhwaginseoPDF(body);
          break;
        case PDF_GEN_API_TYPE.MEDICAL_PAY_DTL_IN_CERT:
          result = await this.jinryobisebuIn(body);
          break;
        case PDF_GEN_API_TYPE.MEDICAL_PAY_DTL_OUT_CERT:
          result = await this.jinryobisebuOut(body);
          break;
        case PDF_GEN_API_TYPE.BILL_INFO:
          result = await this.billInfo(body);
          break;
      }
    }catch (e){
      throw e;
    }

    return result;
  }





  async generateJindanPDF(body) {
    var html;
    var options;

    var his_hsp_tp_cd = body.his_hsp_tp_cd;
    var fileName = body.fileName;
    var pdfInfo = body.pdfInfo;
    var fileCode = body.fileCode;
    var password = body.password;
    var qrName = body.qrName;
    var resultCode = "0000";
    var tmpl = fs.readFileSync(this.viewDir + 'eumc_jindan.html', 'utf8');

    var upurStr = "";

    console.log("his_hsp_tp_cd : " + his_hsp_tp_cd);
    console.log("JSON.parse(pdfInfo).upur_iscm_yn : " + JSON.parse(pdfInfo).upur_iscm_yn);
    console.log("JSON.parse(pdfInfo) : " + JSON.parse(pdfInfo));

    var dg_option = "";
    if (JSON.parse(pdfInfo).dg_option1_yn != null && JSON.parse(pdfInfo).dg_option2_yn != null) {
      dg_option = '<td class="t18">병&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;명<br />(국제질병<br />분류코드)<br /><br /><span style="text-align:left;"><img src="https://cdn.eumc.ac.kr/images/checked.gif">&nbsp;{{dg_option1_yn}}<br/><img src="https://cdn.eumc.ac.kr/images/checked.gif">&nbsp;{{dg_option2_yn}}</span></td>'
    } else if (JSON.parse(pdfInfo).dg_option1_yn != null) {
      dg_option = '<td class="t18">병&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;명<br />(국제질병<br />분류코드)<br /><br /><span style="text-align:left;"><img src="https://cdn.eumc.ac.kr/images/checked.gif">&nbsp;{{dg_option1_yn}}<br/></span></td>'
    } else if (JSON.parse(pdfInfo).dg_option2_yn != null) {
      dg_option = '<td class="t18">병&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;명<br />(국제질병<br />분류코드)<br /><br /><span style="text-align:left;"><img src="https://cdn.eumc.ac.kr/images/checked.gif">&nbsp;{{dg_option2_yn}}<br/></span></td>'
    }

    if (JSON.parse(pdfInfo).upur_iscm_yn != null) {
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/checked.gif">&nbsp;</span><span>보험회사 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>관공서 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>회사 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>학교 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>기타용도</span><br/>';
    }
    if (JSON.parse(pdfInfo).upur_gov_yn != null) {
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>보험회사 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/checked.gif">&nbsp;</span><span>관공서 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>회사 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>학교 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>기타용도</span><br/>';
    }
    if (JSON.parse(pdfInfo).upur_cmp_yn != null) {
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>보험회사 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>관공서 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/checked.gif">&nbsp;</span><span>회사 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>학교 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>기타용도</span><br/>';
    }
    if (JSON.parse(pdfInfo).upur_schl_yn != null) {
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>보험회사 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>관공서 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>회사 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/checked.gif">&nbsp;</span><span>학교 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>기타용도</span><br/>';
    }
    if (JSON.parse(pdfInfo).upur_etc_yn != null) {
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>보험회사 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>관공서 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>회사 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/unchecked.gif">&nbsp;</span><span>학교 제출용</span><br/>';
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/checked.gif">&nbsp;</span><span>기타용도(' + JSON.parse(pdfInfo).upur_etc_cnte + ')</span><br/>';
    }

    var stamp = "";
    if(his_hsp_tp_cd == "02"){
      stamp = '<span class="fstamp"></span>';
    }
    else{
      stamp = '<span class="fstamp_seoul"></span>';
    }

    var tel = "";
    if(JSON.parse(pdfInfo).tel != null) tel = JSON.parse(pdfInfo).tel;

    var dsoc_year = "";
    var dsoc_month = "";
    var dsoc_day = "";
    if(JSON.parse(pdfInfo).dsoc_year != null) dsoc_year = JSON.parse(pdfInfo).dsoc_year;
    if(JSON.parse(pdfInfo).dsoc_month != null) dsoc_month = JSON.parse(pdfInfo).dsoc_month;
    if(JSON.parse(pdfInfo).dsoc_day != null) dsoc_day = JSON.parse(pdfInfo).dsoc_day;

    var rmk_cnte = "";
    if(JSON.parse(pdfInfo).rmk_cnte != null) rmk_cnte = JSON.parse(pdfInfo).rmk_cnte;

    html = tmpl.replace( '{{patName}}', JSON.parse(pdfInfo).pt_nm);
    html = html.replace('{{patJumin1}}', JSON.parse(pdfInfo).rrn1);
    html = html.replace( '{{dg_option}}', dg_option);
    html = html.replace( '{{patJumin2}}', JSON.parse(pdfInfo).rrn2);
    html = html.replace( '{{patAddress}}', JSON.parse(pdfInfo).addr);
    html = html.replace( '{{patPhone}}', tel);
    html = html.replace( '{{dg_option1_yn}}', JSON.parse(pdfInfo).dg_option1_yn);
    html = html.replace( '{{dg_option2_yn}}', JSON.parse(pdfInfo).dg_option2_yn);
    html = html.replace( '{{dg_nm}}', JSON.parse(pdfInfo).dg_nm);
    html = html.replace( '{{dsoc_year}}', dsoc_year);
    html = html.replace('{{dsoc_month}}', dsoc_month);
    html = html.replace( '{{dsoc_day}}', dsoc_day);
    html = html.replace( '{{opinion}}', JSON.parse(pdfInfo).opinion);
    html = html.replace( '{{upur}}', upurStr);
    html = html.replace( '{{dg_year}}', JSON.parse(pdfInfo).dg_year);
    html = html.replace( '{{dg_month}}', JSON.parse(pdfInfo).dg_month);
    html = html.replace( '{{dgc_day}}', JSON.parse(pdfInfo).dgc_day);
    html = html.replace( '{{wrt_year}}', JSON.parse(pdfInfo).wrt_year);
    html = html.replace( '{{wrt_month}}', JSON.parse(pdfInfo).wrt_month);
    html = html.replace( '{{wrt_day}}', JSON.parse(pdfInfo).wrt_day);
    html = html.replace( '{{mdins_nm}}', JSON.parse(pdfInfo).mdins_nm);
    html = html.replace( '{{mdins_addr}}', JSON.parse(pdfInfo).mdins_addr);
    html = html.replace( '{{doc_yn}}', JSON.parse(pdfInfo).doc_yn);
    html = html.replace( '{{lcns_no}}', JSON.parse(pdfInfo).lcns_no);
    html = html.replace( '{{wrtr_nm}}', JSON.parse(pdfInfo).wrtr_nm);
    html = html.replace( '{{dgns_rer_rcdc_no}}', JSON.parse(pdfInfo).dgns_rer_rcdc_no);
    html = html.replace( '{{pt_no}}', JSON.parse(pdfInfo).pt_no);
    html = html.replace( '{{fileCode}}', fileCode);
    html = html.replace( '{{rmk_cnte}}', rmk_cnte);
    html = html.replace( '{{ads_dt}}', JSON.parse(pdfInfo).ads_dt + '~' + JSON.parse(pdfInfo).ds_dt);
    html = html.replace( '{{qrName}}', qrName);
    html = html.replace( '{{deptname}}', JSON.parse(pdfInfo).deptname);
    html = html.replace( 'undefined~undefined', "");
    html = html.replace( 'undefined', "");
    html = html.replace( '{{stamp}}', stamp);

    var jsreport = require('jsreport-core')();
    jsreport.use(require('jsreport-chrome-pdf')({ launchOptions: { args: [ '--no-sandbox', '--disable-setuid-sandbox'] } }))
    jsreport.use(require('jsreport-handlebars')());
    jsreport.use(require('jsreport-pdf-utils')());

    return jsreport.init().then(() => {
      return jsreport.render({
        template: {
          content: html,
          recipe: 'chrome-pdf',
          engine: 'handlebars',
          displayHeaderFooter: true,
          pdfPassword: {
            active: true,
            password: password,
          },
          launchOptions: {
            landscape: false,
            printBackground: true
          }
        },
        data: {
          foo: "world"
        },

      }).then((resp) => {
        // prints pdf with headline Hello world
        console.log("중간이다.");


        var filePath = this.dir + fileName + ".pdf";
        resp.result.pipe(fs.createWriteStream(filePath));
        // console.log(resp.content.toString());

        console.log("다만들었다.");

        return filePath;
      });
    }).catch((e) => {
      console.error(e);
    });
  }

  async generateSogyeonseoPDF(body) {
    var html;
    var options;

    var his_hsp_tp_cd = body.his_hsp_tp_cd;
    var fileCode = body.fileCode;
    var fileName = body.fileName;
    var pdfInfo = body.pdfInfo;
    var qrName = body.qrName;
    var password = body.password;
    var address = body.address;

    var resultCode = "0000";
    var tmpl = fs.readFileSync(this.viewDir + 'eumc_sogyeonseo.html', 'utf8');

    var upurStr = "";

    if (JSON.parse(pdfInfo).upur_otherhsp_yn != null) {
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/checked.gif">&nbsp;</span><span>타병원 제출용</span><br/>'
    }
    if (JSON.parse(pdfInfo).upur_iscm_yn != null) {
      upurStr = upurStr + '<span><img src="https://cdn.eumc.ac.kr/images/checked.gif">&nbsp;</span><span>보험회사, 기관 제출용</span><br/>'
    }

    var stamp = "";
    if(his_hsp_tp_cd == "02"){
      stamp = '<span class="stamp"></span>';
    }
    else{
      stamp = '<span class="stamp_seoul"></span>';
    }

    html = tmpl.replace('{{pt_nm}}', JSON.parse(pdfInfo).pt_nm);
    html = html.replace('{{rrn1}}', JSON.parse(pdfInfo).rrn1);
    html = html.replace('{{rrn2}}', JSON.parse(pdfInfo).rrn2);
    html = html.replace('{{patAddress}}', address);
    html = html.replace('{{patPhone}}', JSON.parse(pdfInfo).tel);
    html = html.replace('{{dg_nm}}', JSON.parse(pdfInfo).dg_nm);
    html = html.replace('{{i_chk}}', JSON.parse(pdfInfo).i_chk);
    html = html.replace('{{i_from_dt}}', JSON.parse(pdfInfo).i_from_dt);
    html = html.replace('{{pasthistory}}', JSON.parse(pdfInfo).pasthistory);
    html = html.replace('{{opinion}}', JSON.parse(pdfInfo).opinion);
    html = html.replace('{{result}}', JSON.parse(pdfInfo).result);
    html = html.replace( '{{upur_iscm_yn}}', JSON.parse(pdfInfo).upur_iscm_yn);
    html = html.replace( '{{rmk}}', JSON.parse(pdfInfo).rmk);
    html = html.replace( '{{wrt_year}}', JSON.parse(pdfInfo).wrt_year);
    html = html.replace( '{{wrt_month}}', JSON.parse(pdfInfo).wrt_month);
    html = html.replace( '{{wrt_day}}', JSON.parse(pdfInfo).wrt_day);
    html = html.replace( '{{mdins_nm}}', JSON.parse(pdfInfo).mdins_nm);
    html = html.replace( '{{mdins_addr}}', JSON.parse(pdfInfo).mdins_addr);
    html = html.replace( '{{lcns_no}}', JSON.parse(pdfInfo).lcns_no);
    html = html.replace( '{{wrtr_nm}}', JSON.parse(pdfInfo).wrtr_nm);
    html = html.replace( '{{dgns_rer_rcdc_no}}', JSON.parse(pdfInfo).dgns_rer_rcdc_no);
    html = html.replace( '{{pt_no}}', JSON.parse(pdfInfo).pt_no);
    html = html.replace( '{{fileCode}}', fileCode);
    html = html.replace( '{{upur}}', upurStr);
    html = html.replace( '{{qrName}}', qrName);
    html = html.replace( '{{stamp}}', stamp);

    // options = {format: 'A3', orientation: 'portrait', timeout: '100000'};
    // pdf.create(html22, options).toFile('dir' + fileName + '.pdf', function (err, respnse) {
    //     if (err) {
    //         resultCode = "2222";
    //         return console.log(err);
    //     }
    //     console.log(res); // { filename: '/app/businesscard.pdf' }
    //     res.send(resultCode);
    // });

    var jsreport = require('jsreport-core')();
    jsreport.use(require('jsreport-chrome-pdf')({ launchOptions: { args: [ '--no-sandbox', '--disable-setuid-sandbox'] } }))
    jsreport.use(require('jsreport-handlebars')());
    jsreport.use(require('jsreport-pdf-utils')());

    return jsreport.init().then(() => {
      return jsreport.render({
        template: {
          content: html,
          recipe: 'chrome-pdf',
          engine: 'handlebars',
          displayHeaderFooter: true,
          pdfPassword: {
            active: true,
            password: password,
          },
          launchOptions: {
            landscape: false,
            printBackground: true
          }
        },
        data: {
          foo: "world"
        },

      }).then((resp) => {
        // prints pdf with headline Hello world
        console.log("중간이다.");


        var filePath = this.dir + fileName + ".pdf";
        resp.result.pipe(fs.createWriteStream(filePath));
        // console.log(resp.content.toString());
        return filePath;
      });
    }).catch((e) => {
      console.error(e);
    });
  }

  async ibtoewonsasilhwaginseoPDF(body) {

    var html;
    var options;

    var his_hsp_tp_cd = body.his_hsp_tp_cd;
    var hospital_name = body.hospital_name;
    var pat_nm = body.pat_nm;
    var pat_no = body.pat_no;
    var fileName = body.fileName;
    var rrn1 = body.rrn1;
    var pdfInfo = body.pdfInfo;
    var fileCode = body.fileCode;
    var qrName = body.qrName;
    var password = body.password;

    var resultCode = "0000";


    var header = '<header id="header" style="height:87px; margin-top: 50px;" >' +
      '<div class="doc_num">' +
      '<span>문서확인번호</span>' +
      '<span>&nbsp;▣&nbsp;</span>' +
      '<span>{{fileCode}}</span>' +
      '<span>&nbsp;▣&nbsp;</span>' +
      '</div>' +
      '<div class="doc_tit" style="margin-top:20px;">' +
      '<span>입 퇴 원 사 실 확 인 서</span>' +
      '</div>' +
      '</header>' +
      '<!-- header end -->' +
      '<!-- container start -->' +
      '<section id="container">' +
      '<div class="table">' +
      '<table>' +
      '<tbody>' +
      '<tr>' +
      '<td class="t20r" style="padding:4px;">등&nbsp;&nbsp;록&nbsp;&nbsp;번&nbsp;&nbsp;호</td>' +
      '<td class="t70l" style="padding:4px; padding-left:30px;">{{pat_no}}</td>' +
      '</tr>' +
      '<tr>' +
      '<td class="t20r" style="padding:4px;">주&nbsp;&nbsp;민&nbsp;&nbsp;번&nbsp;&nbsp;호</td>' +
      '<td class="t70l" style="padding:4px; padding-left:30px;">' +
      '<span>{{rrn1}}</span><span>&nbsp;-&nbsp;</span><span>{{rrn2}}</span></td>' +
      '</tr>' +
      '<tr>' +
      '<td class="t20r" style="padding:4px;">환&nbsp;&nbsp;자&nbsp;&nbsp;성&nbsp;&nbsp;명</td>' +
      '<td class="t70l" style="padding:4px; padding-left:30px;">{{pat_nm}}</td>' +
      '</tr>' +
      '<tr>' +
      '<td class="t20r" style="padding:4px;">제&nbsp;&nbsp;출&nbsp;&nbsp;용&nbsp;&nbsp;도</td>' +
      '<td class="t70l" style="padding:4px; padding-left:30px;"></td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '<div class="table" style="margin-top:20px;">';


    var footer = "<footer id='footer'>" +
      "<div class='total'>" +
      "<span>총&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>{{num}}</span><span>&nbsp;건</span>" +
      "</div>" +
      "<div class='check'>위와 같이입·퇴원 하였음을 확인합니다.</div>" +
      '<div class="check"><span>{{currentYear}}</span>년&nbsp;<span>{{currentMonth}}</span>월&nbsp;<span>{{currentDay}}</span><span>일</span></div>' +
      "<div class='pub'><span>발행자&nbsp;:&nbsp;</span><span>원무팀</span><span>&nbsp;&nbsp;*증*</span></div>" +
      "<div class='hname'>{{hospital_name}}</div>" +
      "{{stamp}}" +
      "<div class='b_info'>※ 본증서에 병원 직인이 있는 경우만 문서로서의 효력을 갖습니다.<br />※ 입원사실확인서에 병명(진단명)은 기재되지 않습니다. (병명은 진단서에만 기재됨)</div>" +
      "<div class='info' style='margin-top:20px;'>" +
      "</div>" +
      "</footer>";


    console.log("password : " + password);

    var str = '';
    var tmpl = fs.readFileSync(this.viewDir + 'eumc_ibtoewonsasilhwaginseo.html', 'utf8');

    var stamp = '';
    if(his_hsp_tp_cd == "02"){
      stamp = "<div class='f2_stamp'></div>";
    }
    else{
      stamp = "<div class='f2_stamp_seoul'></div>";
    }

    for (var i = 1; i < JSON.parse(pdfInfo).length + 1; i++) {
      //for (var i = 1; i < 100 + 1; i++) {
      str = str + '<tr><td class="t28">' + JSON.parse(pdfInfo)[i - 1].indeptname + '</td><td class="t28">' + JSON.parse(pdfInfo)[i - 1].outdeptname + '</td><td class="t54"><span>' + JSON.parse(pdfInfo)[i - 1].inoutdate + '</span></td></tr>';
      //str = str + '<tr><td class="t28">' + JSON.parse(pdfInfo)[1].indeptname + '</td><td class="t28">' + JSON.parse(pdfInfo)[1].outdeptname + '</td><td class="t54"><span>' + JSON.parse(pdfInfo)[1].inoutdate + '</span></td></tr>';

      if (JSON.parse(pdfInfo).size > 10) {
        // if (100 > 10) {
        if (i == 10) {
          console.log("9일때");
          var html_ = tmpl.replace("{{item}}", str);
          html = html_ + header +
            '<table>' +
            '<tbody>' +
            '<tr>' +
            '<td class="t23h">입원과</td>' +
            '<td class="t23h">퇴원과</td>' +
            '<td class="t54h">입원기간</td>' +
            '</tr>' +
            '{{item}}';

          str = "";


        } else if (i % 10 == 0 && i !== 0 && i !== 10 && i !== JSON.parse(pdfInfo).length) {
          // } else if (i % 10 == 0 && i !== 0 && i !== 10 && i !== 100) {
          console.log("중간펑션");
          var html_ = tmpl.replace('{{item}}', str);
          html = html_ + "</tbody></table></div></section>" + footer + header +
            '<table>' +
            '<tbody>' +
            '<tr>' +
            '<td class="t23h">입원과</td>' +
            '<td class="t23h">퇴원과</td>' +
            '<td class="t54h">입원기간</td>' +
            '</tr>' +
            '{{item}}';

          str = "";


        } else if (i == JSON.parse(pdfInfo).length) {
          // } else if (i == 100) {
          console.log("마지막일때");
          var html_ = tmpl.replace("{{item}}", str);

          html = html_ + "</tbody></table></div></section>" + footer + '</div></body></html>';
          str = "";

        }
      } else {

        console.log("10보다 작을 때");
        if (i == JSON.parse(pdfInfo).length) {
          //if (i == 100) {
          console.log("끝이나니?");
          var html_ = tmpl.replace("{{item}}", str);
          html = html_ + '</div></body></html>';
          str = "";
        }

      }
    }

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    var dd_str = '';
    var mm_str = '';

    if (dd < 10) {
      dd_str = '0' + dd;
    }else{
      dd_str = '' + dd;
    }

    if (mm < 10) {
      mm_str = '0' + mm;
    }else{
      mm_str = '' + mm;
    }

    html = html + '</div></body></html>';
    html = html.replace('{{rrn1}}', rrn1);
    html = html.replace( '{{item}}', str);
    html = html.replace( '{{num}}', JSON.parse(pdfInfo).length);
    html = html.replace( '{{pat_no}}', pat_no);
    html = html.replace( '{{fileCode}}', fileCode);
    html = html.replace( '{{qrName}}', qrName);
    html = html.replace( '{{pat_nm}}', pat_nm);
    html = html.replace( '{{currentYear}}', yyyy);
    html = html.replace( '{{currentMonth}}', mm_str);
    html = html.replace( '{{currentDay}}', dd_str);
    html = html.replace( '{{rrn2}}', "*******");
    html = html.replace( '{{hospital_name}}', hospital_name);
    html = html.replace( '{{stamp}}', stamp);


    // options = {format: 'A3', orientation: 'portrait', timeout: '100000'};
    // pdf.create(html5, options).toFile(dir + fileName + '.pdf', function (err, respnse) {
    //     if (err) {
    //         resultCode = "2222";
    //         return console.log(err);
    //     }
    //     console.log(res); // { filename: '/app/businesscard.pdf' }
    //     res.send(resultCode);
    // });

    var jsreport = require('jsreport-core')();
    jsreport.use(require('jsreport-chrome-pdf')({ launchOptions: { args: [ '--no-sandbox', '--disable-setuid-sandbox'] } }))
    jsreport.use(require('jsreport-handlebars')());
    jsreport.use(require('jsreport-pdf-utils')());

    return jsreport.init().then(() => {
      return jsreport.render({
        template: {
          content: html,
          recipe: 'chrome-pdf',
          engine: 'handlebars',
            pdfPassword: {
            active: true,
            password: password,
          },
          launchOptions: {
            landscape: false,
            printBackground: true
          }
        },
        data: {
          foo: "world"
        },

      }).then((resp) => {
        console.log("중간이다.");


        var filePath = this.dir + fileName + ".pdf";
        resp.result.pipe(fs.createWriteStream(filePath));
        // console.log(resp.content.toString());

        return filePath;
      });
    }).catch((e) => {
      console.error(e);
    });
  }


  async tongwonjinryoPDF(body) {
    var options;

    console.log("들어왔다.");
    var locate = body.locate;
    var hospital_name = body.hospital_name;
    var pat_nm = body.pat_nm;
    var pat_no = body.pat_no;
    var rrn1 = body.rrn1;
    var rrn2 = body.rrn2;
    var pdfInfo = body.pdfInfo;
    var fileName = body.fileName;
    var fileCode = body.fileCode;
    var qrName = body.qrName;
    var password = body.password;
    console.log("password : " + password);
    console.log("hospital_name : " + hospital_name);
    console.log("큐알 이름 :" + qrName);

    var resultCode = "0000";
    var html = fs.readFileSync(this.viewDir + 'eumc_tongwonjinryo.html', 'utf8');

    var header = '<header id="header" style="height:87px; margin-top: 87px">' +
      '<div class="doc_num">' +
      '<span>문서확인번호</span>' +
      '<span>&nbsp;▣&nbsp;</span>' +
      '<span>{{fileCode}}</span>' +
      '<span>&nbsp;▣&nbsp;</span>' +
      '</div>' +
      '<div class="doc_tit" style="margin-top:10px;">' +
      '<span>통  원  진  료  확  인  서</span>' +
      '</div>' +
      '</header>' +
      '<section id="container">' +
      '<div class="table" >' +
      '<table >' +
      '<tbody>' +
      '<tr>' +
      '<td class="t20r" style="padding:4px;">등&nbsp;&nbsp;록&nbsp;&nbsp;번&nbsp;&nbsp;호</td>' +
      '<td class="t70l" style="padding:4px; padding-left:30px;">{{pat_no}}</td>' +
      '</tr>' +
      '<tr>' +
      '<td class="t20r" style="padding:4px;">주&nbsp;&nbsp;민&nbsp;&nbsp;번&nbsp;&nbsp;호</td>' +
      '<td class="t70l" style="padding:4px; padding-left:30px;"><span>{{rrn1}}</span><span>&nbsp;-&nbsp;</span><span>{{rrn2}}</span></td>' +
      '</tr>' +
      '<tr>' +
      '<td class="t20r" style="padding:4px;">환&nbsp;&nbsp;자&nbsp;&nbsp;성&nbsp;&nbsp;명</td>' +
      '<td class="t70l" style="padding:4px; padding-left:30px;">{{pat_nm}}</td>' +
      '</tr>' +
      '<tr>' +
      '<td class="t20r" style="padding:4px;">제&nbsp;&nbsp;출&nbsp;&nbsp;용&nbsp;&nbsp;도</td>' +
      '<td class="t70l" style="padding:4px; padding-left:30px;">기타</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '<div class="table" style="margin-top:20px;">';

    var footer =
      '<footer id="footer">' +
      '<div class="total">' +
      '<span>총&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>{{num}}</span><span>&nbsp;건</span>' +
      '</div>' +
      '<div class="check">위와 같이 진료를 실시하였음을 확인합니다.</div>' +
      '<div class="check"><span>{{currentYear}}</span>년&nbsp;<span>{{currentMonth}}</span>월&nbsp;<span>{{currentDay}}</span><span>일</span></div>' +
      '<div class="pub"></div>' +
      '<div class="hname">' +
      '<span>{{hospital_name}}</span>' +
      '{{stamp}}' +
      '</div>' +
      '<div class="b_info">※ 본증서에 병원 직인이 있는 경우만 문서로서의 효력을 갖습니다.<br />※ 입원사실확인서에 병명(진단명)은 기재되지 않습니다. (병명은 진단서에만 기재됨)</div>' +
      '<div class="info" style="margin-top:20px;">' +
      '</div>' +
      '</footer>';


    var stamp = '';
    if(locate == "02"){
      stamp = '<span class="f2_stamp" style="margin-top:-85px; margin-left:10px;"></span>';
    }
    else{
      stamp = '<span class="f2_stamp_seoul" style="margin-top:-85px; margin-left:10px;"></span>';
    }

    // var printhtml = '';
    // for(var i = 0; i <= JSON.parse(pdfInfo).length / 10; i++){
    //     var str = '';
    //     for(var j = i * 10; j < (JSON.parse(pdfInfo).length / 10 + 1) * 10; j++) {
    //         str = str + '<tr><td class="t50b">' + JSON.parse(pdfInfo)[j].deptname + '</td><td class="t50b">' + JSON.parse(pdfInfo)[j].fromdate + '</td></tr>';
    //     }
    //     var html_ = html.replace("{{item}}", str);
    //     printhtml = printhtml + html_ + footer + "</tbody></table></div></section>";
    // }

    var str = '';


    //a4 = 10
    for (var i = 1; i < JSON.parse(pdfInfo).length + 1; i++) {
      //for (var i = 1; i < 100 + 1; i++) {

      str = str + '<tr><td class="t50b">' + JSON.parse(pdfInfo)[i - 1].deptname + '</td><td class="t50b">' + JSON.parse(pdfInfo)[i - 1].fromdate + '</td></tr>';
      //str = str + '<tr><td class="t50b">' + JSON.parse(pdfInfo)[1].deptname + '</td><td class="t50b">' + JSON.parse(pdfInfo)[1].fromdate + '</td></tr>';

      if (JSON.parse(pdfInfo).length > 10) {
        // if (100 > 10) {
        if (i == 10) {

          console.log("9일때");
          var html_ = html.replace("{{item}}", str);
          html = html_ + header +
            "<table>" +
            "<tbody>" +
            "<tr>" +
            "<td class='t50h'>진 료 과</td>" +
            "<td class='t50h'>진 료 일</td>" +
            "</tr>" +
            "{{item}}";
          str = "";

        } else if (i % 10 == 0 && i !== 0 && i !== 10 && i !== JSON.parse(pdfInfo).length) {
          // } else if (i % 10 == 0 && i !== 0 && i !== 10 && i !== 100) {

          console.log("중간펑션");
          var html_ = html.replace('{{item}}', str);
          html = html_ + "</tbody></table></div></section>" + footer + header + "<table>" +
            "<tbody>" +
            "<tr>" +
            "<td class='t50h'>진 료 과</td>" +
            "<td class='t50h'>진 료 일</td>" +
            "</tr>" +
            "{{item}}";

          str = "";

        } else if (i == JSON.parse(pdfInfo).length) {
          // } else if (i == 100) {

          console.log("마지막일때");
          var html_ = html.replace( "{{item}}", str);

          html = html_ + "</tbody></table></div></section>" + footer;
          str = "";

        }
      } else {
        console.log("10보다 작을 때");
        if (i == JSON.parse(pdfInfo).length) {
          // if (i == 100) {
          var html_ = html.replace( "{{item}}", str);
          html = html_ + "</tbody></table></div></section>";
          str = "";
        }
      }
    }
    html = html + '</div></body></html>';

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var dd_str = '';
    var mm_str = '';

    if (dd < 10) {
      dd_str = '0' + dd;
    }else{
      dd_str = '' + dd;
    }

    if (mm < 10) {
      mm_str = '0' + mm;
    }else{
      mm_str = '' + mm;
    }

    html = html.replace('{{pat_nm}}', pat_nm);
    html = html.replace('{{pat_no}}', pat_no);
    html = html.replace('{{rrn1}}', rrn1);
    html = html.replace('{{rrn2}}', "*******");
    html = html.replace('{{num}}', JSON.parse(pdfInfo).length);
    html = html.replace('{{fileCode}}', fileCode);
    html = html.replace('{{qrName}}', qrName);
    html = html.replace('{{currentYear}}', yyyy + '');
    html = html.replace('{{currentMonth}}', mm_str);
    html = html.replace( '{{currentDay}}', dd_str);
    html = html.replace('{{hospital_name}}', hospital_name);
    html = html.replace('{{stamp}}', stamp);


    //options = {format: 'A3', orientation: 'portrait', timeout: '100000'};

    // console.log("거의 다 만들었다.");
    // pdf.create(html7, options).toFile(dir + fileName + '.pdf', function (err, respnse) {
    //     if (err) {
    //         console.log("에러다.");
    //         console.log(err);
    //         resultCode = "2222";
    //         // res.send(resultCode);
    //         return console.log(err);
    //     }
    //     console.log("다만들었다.");
    //     res.send(resultCode);
    //     // { filename: '/app/businesscard.pdf' }
    // });

    console.log("만들기시작");
    var jsreport = require('jsreport-core')();
    jsreport.use(require('jsreport-chrome-pdf')({ launchOptions: { args: [ '--no-sandbox', '--disable-setuid-sandbox'] } }))
    jsreport.use(require('jsreport-handlebars')());
    jsreport.use(require('jsreport-pdf-utils')());


    return jsreport.init().then(() => {
      return jsreport.render({
        template: {
          content: html,
          recipe: 'chrome-pdf',
          engine: 'handlebars',
          displayHeaderFooter: true,
          pdfPassword: {
            active: true,
            password: password,
          },
          launchOptions: {
            landscape: false,
            printBackground: true
          }
        },
        data: {
          foo: "world"
        },

      }).then((resp) => {
        // prints pdf with headline Hello world
        console.log("중간이다.");


        var filePath = this.dir + fileName + ".pdf";
        resp.result.pipe(fs.createWriteStream(filePath));
        // console.log(resp.content.toString());
        return filePath;
      });
    }).catch((e) => {
      console.error(e);
    });
  }

  async jinlyobinabibhwaginseoPDF(body){
    var html;
    var options;

    var his_hsp_tp_cd = body.his_hsp_tp_cd;
    var pat_nm = body.pat_nm;
    var pat_no = body.pat_no;
    var fileName = body.fileName;
    var rrn1 = body.rrn1;
    var rrn2 = body.rrn2;
    var qrName = body.qrName;
    var pdfInfo = body.pdfInfo;
    var fileCode = body.fileCode;
    var password = body.password;
    var companyNumber = body.companyNumber;
    var hospitalName = body.hospitalName;
    var hospitalAddress = body.hospitalAddress;
    var ownerName = body.ownerName;
    var html_;

    var resultCode = "0000";
    var tmpl = fs.readFileSync(this.viewDir + 'eumc_jinlyobinabibhwaginseo.html', 'utf8');

    var str = '';
    var totamt = 0;
    var reqamt = 0;
    var ownamt = 0;
    var cardamt = 0;
    var cashamt = 0;
    var rcpamt = 0;

    var stamp = '';
    if(his_hsp_tp_cd == "02"){
      stamp = '                <div class="footer_stamp"><img src="https://cdn.eumc.ac.kr/images/seal.png" style="width: 80px; height: 80px;"></div>';
    }
    else{
      stamp = '                <div class="footer_stamp"><img src="https://cdn.eumc.ac.kr/images/seal_seoul.png" style="width: 80px; height: 80px;"></div>';
    }

    var header = "<header id='header' style='height:65px; box-sizing:border-box; border:1px solid #000000; margin-top: 30px;'>" +
      "<div class='doc_num'>" +
      "<span>문서확인번호</span>" +
      "<span>&nbsp;▣&nbsp;</span>" +
      "<span>{{fileCode}}</span>" +
      "<span>&nbsp;▣&nbsp;</span>" +
      "</div>" +
      "<div class='doc_tit'>" +
      "<span>진료비&nbsp;납입확인서(월별)</span>" +
      "</div>" +
      "<div class='tit_line'></div>" +
      "</header>" +
      "<!-- header end -->" +
      "<!-- container start -->" +
      "<section id='container' >" +
      "<!--<section id='container' style='margin-top:64px;'>-->" +
      "<div class='d_table'>" +
      "<div class='d18'>환 자 성 명</div>" +
      "<div class='d32'>&nbsp;{{pat_nm}}</div>" +
      "<div class='d18'>주민등록번호</div>" +
      "<div class='d32e'>&nbsp;{{rrn1}}- {{rrn2}}</div>" +
      "<div class='d14'><span>수납일자<br />(진료기간)</span></div>" +
      "<div class='d22'><span>구분<br />(입원, 외래)</span></div>" +
      "<div class='d33'>" +
      "<div class='d33t'>진 료 비 내 역</div>" +
      "<div class='d11'>총 액</div>" +
      "<div class='d11' style='letter-spacing:-1px;'>보험자부담액</div>" +
      "<div class='d11e'>환자부담액</div>" +
      "</div>" +
      "<div class='d33e'>" +
      "<div class='d33t'>소득공제 대상액</div>" +
      "<div class='d11'>카 드</div>" +
      "<div class='d11'>현금영수증</div>" +
      "<div class='d11e'>현 금</div>" +
      "</div>" +
      "{{item}}";

    var footer = '<div class="footer">' +
      '{{stamp}} '+
      '                <div class="dtotal">' +
      // '                    <div class="dt18">총 계</div>' +
      // '                    <div class="dt22"></div>' +
      // '                    <div class="dt30">' +
      // '                        <div class="dt10">{{totamt}}</div>' +
      // '                        <div class="dt10">{{reqamt}}</div>' +
      // '                        <div class="dt10">{{ownamt}}</div>' +
      // '                    </div>' +
      // '                    <div class="dt30">' +
      // '                        <div class="dt10">{{cardamt}}</div>' +
      // '                        <div class="dt10">{{cashamt}}</div>' +
      // '                        <div class="dt10e">{{rcpamt}}</div>' +
      // '                    </div>' +
      '                    <div class="dt18" style="border-top:1px solid #000000;">사업장등록번호</div>' +
      '                    <div class="dt32">{{companyNumber}}</div>' +
      '                    <div class="dt18" style="border-top:1px solid #000000;">상호(법인명)</div>' +
      '                    <div class="dt32e">{{hospitalName}}</div>' +
      '                    <div class="dt18" style="height:40px; border-top:1px solid #000000;">사업장소재지</div>' +
      '                    <div class="dt32" style="height:40px;">{{hospitalAddress}}<br />{{hospitalName}}</div>' +
      '                    <div class="dt18" style="height:40px; border-top:1px solid #000000;">성 명</div>' +
      '                    <div class="dt32e" style="height:40px;">{{ownerName}}&nbsp;&nbsp;(인)</div>' +
      '                    <div class="dt100">{{printDate}}</div>' +
      '                    <div class="dt100n" style="border-top:1px solid #000000;">※ 이 납입 확인서는 소득세법상 의료비 공제신청에 사용할 수 있습니다.</div>' +
      '                    <div class="dt100n">※ 고객님의 개인정보 보호를 위해 주민등록번호 일부를 XXXX 처리 하였습니다.</div>' +
      '                    <div class="dt100m">주 : 소득세법시행령 제 110조제2항에 따라 환자부담액 중 미용, 성형수술을 위한 비용 및 건강증진을 위한 의약품<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;구입비용은 소득공제 대상액에 포함되지 않습니다.</div>' +
      '                </div>' +
      '            </div>' +
      '<div class="info" style="margin-top:20px;">' +
      '                    </div>';
    var qrFooter = '<div class="info" style="margin-top:20px;">' +
      '                    </div>';

    console.log("===============================");
    console.log(JSON.parse(pdfInfo)[0]);
    console.log("===============================");


    let middleStr = "</div>" +
      "</section>";

    const jsonParsed = JSON.parse(pdfInfo);

    for (var i = 1; i < jsonParsed.length + 1; i++) {

      const json = jsonParsed[i-1];
      // if (i == JSON.parse(pdfInfo).length) {
      //     totamt = totamt + Number(JSON.parse(pdfInfo)[i - 1].totamt);
      //     reqamt = reqamt + Number(JSON.parse(pdfInfo)[i - 1].reqamt);
      //     ownamt = ownamt + Number(JSON.parse(pdfInfo)[i - 1].ownamt);
      //     cardamt = cardamt + Number(JSON.parse(pdfInfo)[i - 1].cardamt);
      //     cashamt = cashamt + Number(JSON.parse(pdfInfo)[i - 1].cashamt);
      //     rcpamt = rcpamt + Number(JSON.parse(pdfInfo)[i - 1].rcpamt);
      // } else {
      str = str + '<div class="dline"><div class="d14">' + (json.orddate != null ? json.orddate.substring(0, 10) : (typeof json.orddate == 'undefined' ? '' : json.orddate)) + '</div><div class="d22"><span class="d22l">' + (typeof json.patsite == 'undefined' ? '' : json.patsite) + '</span><span span class="d22r">' + JSON.parse(pdfInfo)[i - 1].deptname + '</span></div><div class="d32"><div class="d11">' + this.numberWithCommas(json.totamt) + '</div><div class="d11">' + this.numberWithCommas(json.reqamt) + '</div><div class="d11e">' + this.numberWithCommas(json.ownamt) + '&nbsp;</div></div><div class="d32" style="border-right:0;"><div class="d11">' + this.numberWithCommas(json.cardamt) + '</div><div class="d11">' + this.numberWithCommas(json.cashamt) + '</div><div class="d11e">' + this.numberWithCommas(json.rcpamt) + '&nbsp;</div></div></div>';
      // }

      if (JSON.parse(pdfInfo).length > 28) {
        if (i == 28) {
          html_ = tmpl.replace("{{item}}", str);
          html = html_ + middleStr + qrFooter + header;
          str = "";
        } else if (i % 28 == 0 && i !== 0 && i !== 28) {
          html_ = html.replace( "{{item}}", str);
          html = html_ + middleStr + qrFooter + header;
          str = "";
        } else if (i == JSON.parse(pdfInfo).length) {
          html_ = html.replace( "{{item}}", str);
          html = html_ + middleStr + footer;
          str = "";
        }
      } else {
        if (JSON.parse(pdfInfo).length < 24) {
          if (i == JSON.parse(pdfInfo).length) {
            html_ = tmpl.replace( "{{item}}", str);
            html = html_ + middleStr + footer;
            str = "";
          }
        } else {
          if (i == 23 && i !== JSON.parse(pdfInfo).length) {
            html_ = tmpl.replace( "{{item}}", str);
            html = html_ + '<div class="dline"></div><div class="dline"></div><div class="dline"></div><div class="dline"></div><div class="dline"></div>'
            html = html + middleStr + qrFooter + header;
            str = "";
          } else if (i == JSON.parse(pdfInfo).length) {
            html_ = html.replace( "{{item}}", str);
            html = html_ + middleStr + footer;
            str = "";
          }

        }

      }

    }

    html = html + "</body> </html>";

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var printDate = yyyy + " 년 " + mm + " 월 " + dd + " 일";

    html = html.replace('{{pat_nm}}', pat_nm);
    html = html.replace( '{{rrn1}}', rrn1);
    html = html.replace( '{{rrn2}}', "*******");
    html = html.replace( '{{totamt}}', this.numberWithCommas(totamt));
    html = html.replace( '{{reqamt}}', this.numberWithCommas(reqamt));
    html = html.replace( '{{ownamt}}', this.numberWithCommas(ownamt));
    html = html.replace( '{{cardamt}}',this.numberWithCommas(cardamt));
    html = html.replace( '{{cashamt}}',this.numberWithCommas(cashamt));
    html = html.replace( '{{rcpamt}}', this.numberWithCommas(rcpamt));
    html = html.replace( '{{fileCode}}', fileCode);
    html = html.replace( '{{companyNumber}}', companyNumber);
    html = html.replace( '{{hospitalName}}', hospitalName);
    html = html.replace( '{{hospitalAddress}}', hospitalAddress);
    html = html.replace( '{{ownerName}}', ownerName);
    html = html.replace( '{{printDate}}', printDate);
    html = html.replace( '{{stamp}}', stamp);
    html = html.replace( '{{qrName}}', qrName);


    var jsreport = require('jsreport-core')();
    jsreport.use(require('jsreport-chrome-pdf')({ launchOptions: { args: [ '--no-sandbox', '--disable-setuid-sandbox'] } }))
    jsreport.use(require('jsreport-handlebars')());
    jsreport.use(require('jsreport-pdf-utils')());


    console.log("만들기 시작");

    return jsreport.init().then(() => {
      return jsreport.render({
        template: {
          content: html,
          recipe: 'chrome-pdf',
          engine: 'handlebars',
          displayHeaderFooter: true,
          pdfPassword: {
            active: true,
            password: password,
            /* ...other options... */

          },
          launchOptions: {
            landscape: false,
            printBackground: true
          }
        },
        data: {
          foo: "world"
        },

      }).then((resp) => {
        // prints pdf with headline Hello world
        console.log("중간이다.");


        var filePath = this.dir + fileName + ".pdf";
        resp.result.pipe(fs.createWriteStream(filePath));
        // console.log(resp.content.toString());
        return filePath;
      });
    }).catch((e) => {
      console.error(e);
    });
  }

  async jinryobisebuIn(body){
    var his_hsp_tp_cd = body.his_hsp_tp_cd;
    var hospital_name = body.hospital_name;
    var pat_nm = body.pat_nm;
    var pat_no = body.pat_no;
    var fileName = body.fileName;
    var pdfInfo = body.pdfInfo;
    var fileCode = body.fileCode;
    var qrName = body.qrName;
    var password = body.password;

    var resultCode = "0000";

    var html = fs.readFileSync(this.viewDir + 'eumc_jinryobisebuIn.html', 'utf8');
    var html_;

    console.log("진료비 세부내역서 입원");

    var header = '<header id="header">' +
      '<div class="doc_num" style="font-size:11px;">' +
      '<div></div>' +
      '<div></div>' +
      '<div>문서확인번호 ▣ {{fileCode}} ▣ </div>' +
      '<div></div>' +
      '</div>' +
      '<div class="doc_tit">진료비 세부산정내역(입원)</div>' +
      '<div class="doc_info">' +
      '<div class="dit_l">출력일자 :&nbsp;</div>' +
      '<div class="dit_r">{{currentYear}}-{{currentMonth}}-{{currentDay}}</div>' +
      '<div class="dit_l">출력자 :&nbsp;</div>' +
      '<div class="dit_r">{{pat_nm}}</div>' +
      '</div>' +
      '<div class="h_table">' +
      '<div class="ht15">환자등록번호</div>' +
      '<div class="ht15">환자성명</div>' +
      '<div class="ht15">진료기간</div>' +
      '<div class="ht15">병실</div>' +
      '<div class="ht20">환자구분</div>' +
      '<div class="ht20e">비고</div>' +
      '<div class="ht15" style="box-sizing:border-box; border-bottom:1px solid #000000;">{{pat_no}}</div>' +
      '<div class="ht15" style="box-sizing:border-box; border-bottom:1px solid #000000;">{{pat_nm}}</div>' +
      '<div class="ht15" style="box-sizing:border-box; border-bottom:1px solid #000000;">{{fromdate}} ~ {{todate}}</div>' +
      '<div class="ht15" style="box-sizing:border-box; border-bottom:1px solid #000000;"></div>' +
      '<div class="ht20" style="box-sizing:border-box; border-bottom:1px solid #000000;">입원</div>' +
      '<div class="ht20e" style="box-sizing:border-box; border-bottom:1px solid #000000;"></div>' +
      '<div class="h10"></div>' +
      '' +
      '<div class="ht6" style="height:66px; line-height:66px;">항목</div>' +
      '<div class="ht10" style="height:66px; line-height:66px;">일자</div>' +
      '<div class="ht6" style="height:66px; line-height:66px;">코드</div>' +
      '<div class="ht25" style="height:66px; line-height:66px;">명칭</div>' +
      '<div class="ht6" style="height:66px; line-height:66px;">금액</div>' +
      '<div class="ht3" style="height:66px; line-height:66px;">횟수</div>' +
      '<div class="ht3" style="height:66px; line-height:66px;">일수</div>' +
      '<div class="ht6" style="height:66px; line-height:66px;">총액</div>' +
      '<div class="ht24" style="height:66px;">' +
      '<span style="display:block; width:100%; height:22px; box-sizing:border-box; border-bottom:1px solid #000000;">급여</span>' +
      '<span style="display:block; float:left; width:70%; height:22px; box-sizing:border-box; border-bottom:1px solid #000000;">일부본인부담</span>' +
      '<span style="display:block; float:left; width:30%; height:44px; line-height:44px; letter-spacing:-1px; box-sizing:border-box; border-left:1px solid #000000; border-bottom:1px solid #000000;">전액본임부담</span>' +
      '<span style="display:block; float:left; width:35%; height:22px; margin-top:-22px; box-sizing:border-box; border-bottom:1px solid #000000;">본인부담금</span>' +
      '<span style="display:block; float:left; width:35%; height:22px; margin-left:35%; margin-top:-22px; box-sizing:border-box; border-left:1px solid #000000; border-bottom:1px solid #000000;">공단부담금</span>' +
      '</div>' +
      '<div class="ht7e" style="height:66px; line-height:66px;">비급여</div>' +
      '</div>' +
      '</header>' +
      '<!-- header end -->' +
      '<!-- container start -->' +
      '<section id="container" style="margin-top:217px;">' +
      '<div class="c_table">' +
      '{{item}}';


    var footer = '<footer id="footer">' +
      '<div class="f_info">' +
      '<span>신청인&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>{{pat_nm}}</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(환자와의 관계 : </span><span>본인</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)의 요청에 따라</span><br />' +
      '<span>.진료비 계산서·영수증 세부산정내역을 발급합니다<br /><span>{{currentYear}}년{{currentMonth}}월{{currentDay}}일</span> ' +
      '</div>' +
      '<div class="f_infob">' +
      '<div class="fi20">요양기관 명칭</div>' +
      '<div class="fi40">{{hospital_name}}</div>' +
      '<div class="fi12">대표자</div>' +
      '<div class="fi8">유경하</div>' +
      '{{stamp}}' +
      '<div class="fi100">&nbsp;&nbsp;&nbsp;&nbsp;.1 .진료비 계산서·영수증의 세부내역서는 환자의 구체적인 처방 내역 등이 확인되므로 원칙적으로 환자 본인 외에 발급을 금합니다<br />' +
      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;다만, 본 세부내역서 발급에 대해 별도로 환자 본인으로부터 위임을 받은 것이 확인된 자 또는 법정대리인에겐 발급이 가능합니다.<br />' +
      '&nbsp;&nbsp;&nbsp;&nbsp;.2 .비고란은 세부산정내역을 발부하는 영수증번호 등 요양기관이 필요한 경우 추가 기재하는 공간으로 활용할 수 있습니다<br />' +
      '&nbsp;&nbsp;&nbsp;&nbsp;.3 .동 서식에 명시된 항목은 「국민건강보험 요양급여의 기준에 관한 규칙」 제7조제3항에 따라 필수 기재되어야 합니다' +
      '</div>' +
      '</div>' +
      '</footer>';


    var qrFooter = '<div class="info" style="margin-top:-10px;">' +
      '</div>';

    var middleStr = '</div></section>';

    var fromdate = JSON.parse(pdfInfo)[0].fromdate;
    var todate = JSON.parse(pdfInfo)[JSON.parse(pdfInfo).length - 1].todate;

    var stamp = "";
    if(his_hsp_tp_cd == "02"){
      stamp = '<div class="fi20"><span class="stamp"></span></div>';
    }
    else{
      stamp = '<div class="fi20"><span class="stamp_seoul"></span></div>';
    }

    var str = '';
    var num = 0;
    var no = 0;

    for (var i = 1; i < JSON.parse(pdfInfo).length + 1; i++) {
      num = num + 1;

      if (JSON.parse(pdfInfo)[i - 1].codename.replace(" ", "").includes("소계") == true) {
        console.log("몇개 찍히냐");
        if (i != JSON.parse(pdfInfo).length + 1) {
          if (JSON.parse(pdfInfo)[i].codename.replace(" ", "").includes("합계") == true) {
            num = num + 1;
          } else {
            num = num + 1;
          }
        }
      }

    }

    for (var i = 1; i < JSON.parse(pdfInfo).length + 1; i++) {

      // console.log(" 아이 : " + i);
      // console.log("meddept : " + JSON.parse(pdfInfo)[i - 1]);
      // console.log("codename : " + JSON.parse(pdfInfo)[i - 1].codename);
      // console.log("codename : " + JSON.parse(pdfInfo)[i - 1].codename.replace(" ", ""));
      // console.log("codename.include : " + JSON.parse(pdfInfo)[i - 1].codename.replace(" ", "").includes("소계"));
      // console.log("codename.include : " + JSON.parse(pdfInfo)[i - 1].codename.replace(" ", "").includes("합계"));

      if (i == 1) {
        str = str + '<div class="ct10" style="text-align:left;">&nbsp;' + JSON.parse(pdfInfo)[i - 1].codename + '</div><div class="ct10" style="text-align:right;">&nbsp;</div><div class="ct80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>';
        no = no + 1;
        // console.log(" 아이 : " + i);
        // console.log(" 엔오 : " + no);
        // console.log(" 넘 : " + num);
      }

      // console.log("no : " + no);

      if (JSON.parse(pdfInfo)[i - 1].codename.replace(" ", "").includes("소계")) {

        str = str + '<div class="ct6">&nbsp;</div><div class="ct10" style="text-align:right;">' + JSON.parse(pdfInfo)[i - 1].codename + '</div><div class="ct6" style="text-align:center;"></div><div class="ct25"></div><div class="ct6" style="text-align:right;"></div>' +
          '<div class="ct3"></div><div class="ct3"></div><div class="ct6" style="text-align:right;">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].sumprice) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insamt) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].inreamt) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insall) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].uncamt) + '</div>';
        no = no + 1;
        // console.log(" 아이 : " + i);
        // console.log(" 엔오 : " + no);
        // console.log(" 넘 : " + num);

        if (num > 27) {
          if (no == 27) {
            html_ = html.replace( "{{item}}", str);
            html = html_ + middleStr + qrFooter + header;
            str = "";
          } else if (no % 27 == 0 && no !== 0 && no !== 27 && no != num) {
            html_ = html.replace( "{{item}}", str);
            html = html_ + middleStr + qrFooter + header;
            str = "";
          } else if (no == num) {
            if ((no % 27) < 21) {
              html_ = html.replace( "{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            } else {
              var elseNum = 27 - (no % 27);
              for (var j = 0; j < elseNum; j++) {
                str = str + '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
              }
              html_ = html.replace( "{{item}}", str);
              html = html_ + middleStr + qrFooter + header + middleStr + footer + qrFooter;
              str = "";
            }
          }
        } else {
          if (num < 24) {
            if (no == num) {
              html_ = html.replace( "{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            }
          } else {
            if (no == 21 && no !== num) {
              html_ = html.replace( "{{item}}", str);
              html = html_ +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
              html = html + middleStr + qrFooter + header;
              str = "";
            } else if (no == num) {
              html_ = html.replace( "{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            }
          }
        }

        if (no != num) {
          if (JSON.parse(pdfInfo)[i].codename.replace(" ", "").includes("합계")) {

            str = str + '<div class="ct6">&nbsp;</div><div class="ct10" style="text-align:right;">' + JSON.parse(pdfInfo)[i].codename + '</div><div class="ct6" style="text-align:center;"></div><div class="ct25"></div><div class="ct6" style="text-align:right;"></div>' +
              '<div class="ct3"></div><div class="ct3"></div><div class="ct6" style="text-align:right;">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].sumprice) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insamt) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].inreamt) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insall) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].uncamt) + '</div>';

            no = no + 1;
            // console.log(" 아이 : " + i);
            // console.log(" 엔오 : " + no);
            // console.log(" 넘 : " + num);

            if (num > 27) {
              if (no == 27) {
                html_ = html.replace( "{{item}}", str);
                html = html_ + middleStr + qrFooter + header;
                str = "";
              } else if (no % 27 == 0 && no !== 0 && no !== 27 && no != num) {
                html_ = html.replace( "{{item}}", str);
                html = html_ + middleStr + qrFooter + header;
                str = "";
              } else if (no == num) {
                if ((no % 27) < 21) {
                  html_ = html.replace( "{{item}}", str);
                  html = html_ + middleStr + footer + qrFooter;
                  str = "";
                } else {
                  var elseNum = 27 - (no % 27);
                  for (var j = 0; j < elseNum; j++) {
                    str = str + '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                  }
                  html_ = html.replace( "{{item}}", str);
                  html = html_ + middleStr + qrFooter + header + middleStr + footer + qrFooter;
                  str = "";
                }
              }
            } else {
              if (num < 24) {
                if (no == num) {
                  html_ = html.replace( "{{item}}", str);
                  html = html_ + middleStr + footer + qrFooter;
                  str = "";
                }
              } else {
                if (no == 21 && no !== num) {
                  html_ = html.replace( "{{item}}", str);
                  html = html_ +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                  html = html + middleStr + qrFooter + header;
                  str = "";
                } else if (no == num) {
                  html_ = html.replace( "{{item}}", str);
                  html = html_ + middleStr + footer + qrFooter;
                  str = "";
                }
              }
            }

            i = i + 1;

            if (no != num) {

              str = str + '<div class="ct10" style="text-align:left;">&nbsp;' + JSON.parse(pdfInfo)[i].codename + '</div><div class="ct10" style="text-align:right;">&nbsp;</div><div class="ct80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>';
              no = no + 1;
              // console.log(" 아이 : " + i);
              // console.log(" 엔오 : " + no);
              // console.log(" 넘 : " + num);

              if (num > 27) {
                if (no == 27) {
                  html_ = html.replace( "{{item}}", str);
                  html = html_ + middleStr + qrFooter + header;
                  str = "";
                } else if (no % 27 == 0 && no !== 0 && no !== 27 && no != num) {
                  html_ = html.replace( "{{item}}", str);
                  html = html_ + middleStr + qrFooter + header;
                  str = "";
                } else if (no == num) {
                  if ((no % 27) < 21) {
                    html_ = html.replace( "{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  } else {
                    var elseNum = 27 - (no % 27);
                    for (var j = 0; j < elseNum; j++) {
                      str = str + '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                    }
                    html_ = html.replace( "{{item}}", str);
                    html = html_ + middleStr + qrFooter + header + middleStr + footer + qrFooter;
                    str = "";
                  }
                }
              } else {
                if (num < 24) {
                  if (no == num) {
                    html_ = html.replace( "{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  }
                } else {
                  if (no == 21 && no !== num) {
                    html_ = html.replace( "{{item}}", str);
                    html = html_ +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                    html = html + middleStr + qrFooter + header;
                    str = "";
                  } else if (no == num) {
                    html_ = html.replace( "{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  }
                }
              }

            }
          } else {
            if (no != num) {

              str = str + '<div class="ct10" style="text-align:left;">&nbsp;' + JSON.parse(pdfInfo)[i].codename + '</div><div class="ct10" style="text-align:right;">&nbsp;</div><div class="ct80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>';
              no = no + 1;
              // console.log(" 아이 : " + i);
              // console.log(" 엔오 : " + no);
              // console.log(" 넘 : " + num);

              if (num > 27) {
                if (no == 27) {
                  html_ = html.replace( "{{item}}", str);
                  html = html_ + middleStr + qrFooter + header;
                  str = "";
                } else if (no % 27 == 0 && no !== 0 && no !== 27 && no != num) {
                  html_ = html.replace( "{{item}}", str);
                  html = html_ + middleStr + qrFooter + header;
                  str = "";
                } else if (no == num) {
                  if ((no % 27) < 21) {
                    html_ = html.replace( "{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  } else {
                    var elseNum = 27 - (no % 27);
                    for (var j = 0; j < elseNum; j++) {
                      str = str + '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                    }
                    html_ = html.replace( "{{item}}", str);
                    html = html_ + middleStr + qrFooter + header + middleStr + footer + qrFooter;
                    str = "";
                  }
                }
              } else {
                if (num < 24) {
                  if (no == num) {
                    html_ = html.replace( "{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  }
                } else {
                  if (no == 21 && no !== num) {
                    html_ = html.replace( "{{item}}", str);
                    html = html_ +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                    html = html + middleStr + qrFooter + header;
                    str = "";
                  } else if (no == num) {
                    html_ = html.replace( "{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  }
                }
              }

            }
          }
        }
      } else {
        str = str + '<div class="ct6">&nbsp;' + JSON.parse(pdfInfo)[i - 1].edicode + '</div><div class="ct10" style="text-align:right; letter-spacing:-1px;">&nbsp;' + JSON.parse(pdfInfo)[i - 1].fromdate + '~' + JSON.parse(pdfInfo)[i - 1].todate + '</div><div class="ct6" style="text-align:center;">' + JSON.parse(pdfInfo)[i - 1].edicode + '</div><div class="ct25">' + JSON.parse(pdfInfo)[i - 1].korname + '</div><div class="ct6" style="text-align:right;">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].price) + '</div>' +
          '<div class="ct3">' + JSON.parse(pdfInfo)[i - 1].useqty + '</div><div class="ct3">' + JSON.parse(pdfInfo)[i - 1].useday + '</div><div class="ct6" style="text-align:right;">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].sumprice) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insamt) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insall) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].uncamt) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].toinsall) + '</div>';
        no = no + 1;

        if (num > 27) {
          if (no == 27) {
            html_ = html.replace( "{{item}}", str);
            html = html_ + middleStr + qrFooter + header;
            str = "";
          } else if (no % 27 == 0 && no !== 0 && no !== 27 && no != num) {
            html_ = html.replace( "{{item}}", str);
            html = html_ + middleStr + qrFooter + header;
            str = "";
          } else if (no == num) {
            if ((no % 27) < 21) {
              html_ = html.replace( "{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            } else {
              var elseNum = 27 - (no % 27);
              for (var j = 0; j < elseNum; j++) {
                str = str + '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
              }
              html_ = html.replace( "{{item}}", str);
              html = html_ + middleStr + qrFooter + header + middleStr + footer + qrFooter;
              str = "";
            }
          }
        } else {
          if (num < 24) {
            if (no == num) {
              html_ = html.replace( "{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            }
          } else {
            if (no == 21 && no !== num) {
              html_ = html.replace( "{{item}}", str);
              html = html_ +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
              html = html + middleStr + qrFooter + header;
              str = "";
            } else if (no == num) {
              html_ = html.replace( "{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            }
          }
        }
      }
    }

    html = html + '</div></body></html>';

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    var dd_str = '';
    var mm_str = '';

    if (dd < 10) {
      dd_str = '0' + dd;
    }else{
      dd_str = '' + dd;
    }

    if (mm < 10) {
      mm_str = '0' + mm;
    }else{
      mm_str = '' + mm;
    }

    html = html.replace('{{currentYear}}', yyyy+'');
    html = html.replace('{{currentMonth}}', mm_str);
    html = html.replace('{{currentDay}}', dd_str);
    html = html.replace('{{pat_nm}}', pat_nm);
    html = html.replace('{{pat_no}}', pat_no);
    html = html.replace('{{fileCode}}', fileCode);
    html = html.replace('{{qrName}}', qrName);
    html = html.replace('{{fromdate}}', fromdate);
    html = html.replace('{{todate}}', todate);
    html = html.replace( 'undefined', "");
    html = html.replace( '{{hospital_name}}', hospital_name);
    html = html.replace( '{{stamp}}', stamp);

    var jsreport = require('jsreport-core')();
    jsreport.use(require('jsreport-chrome-pdf')({ launchOptions: { args: [ '--no-sandbox', '--disable-setuid-sandbox'] } }))
    jsreport.use(require('jsreport-handlebars')());
    jsreport.use(require('jsreport-pdf-utils')());


    console.log("만들기 시작");

    return jsreport.init().then(() => {
      return jsreport.render({
        template: {
          content: html,
          recipe: 'chrome-pdf',
          engine: 'handlebars',
          displayHeaderFooter: true,
          pdfPassword: {
            active: true,
            password: password,
            /* ...other options... */
          },
          launchOptions: {
            // Landscape: true,
            // printBackground: true
          },
          chrome: {
            landscape: true,
            printBackground: true,
            format: 'A4'
          }
        },
        data: {
          foo: "world"
        },

      }).then((resp) => {
        // prints pdf with headline Hello world
        console.log("중간이다.");


        var filePath = this.dir + fileName + ".pdf";
        resp.result.pipe(fs.createWriteStream(filePath));
        // console.log(resp.content.toString());
        return filePath;
      });
    }).catch((e) => {
      console.error(e);
    });
  }

  async jinryobisebuOut(body){
    var his_hsp_tp_cd = body.his_hsp_tp_cd;
    var hospital_name = body.hospital_name;
    var pat_nm = body.pat_nm;
    var pat_no = body.pat_no;
    var fileName = body.fileName;
    var pdfInfo = body.pdfInfo;
    var fileCode = body.fileCode;
    var qrName = body.qrName;
    var password = body.password;

    var resultCode = "0000";

    console.log("진료비 세부내역서 외래");

    var html_;

    var header = '<header id="header">' +
      '<div class="doc_num" style="font-size:11px;">' +
      '<div></div>' +
      '<div></div>' +
      '<div>문서확인번호 ▣ {{fileCode}} ▣</div>' +
      '<div></div>' +
      '</div>' +
      '<div class="doc_tit">진료비 세부산정내역(외래)</div>' +
      '<div class="doc_info">' +
      '<div class="dit_l">출력일자 :&nbsp;</div>' +
      '<div class="dit_r">{{currentYear}}-{{currentMonth}}-{{currentDay}}</div>' +
      '<div class="dit_l">출력자 :&nbsp;</div>' +
      '<div class="dit_r">{{pat_nm}}</div>' +
      '<div class="dit_l"></div>' +
      '<div class="dit_r"></div>' +
      '</div>' +
      '<div class="h_table">' +
      '<div class="ht15">환자등록번호</div>' +
      '<div class="ht15">환자성명</div>' +
      '<div class="ht15">진료기간</div>' +
      '<div class="ht15">병실</div>' +
      '<div class="ht20">환자구분</div>' +
      '<div class="ht20e">비고</div>' +
      '<div class="ht15" style="box-sizing:border-box; border-bottom:1px solid #000000;">{{pat_no}}</div>' +
      '<div class="ht15" style="box-sizing:border-box; border-bottom:1px solid #000000;">{{pat_nm}}</div>' +
      '<div class="ht15" style="box-sizing:border-box; border-bottom:1px solid #000000;">{{fromdate}} ~ {{todate}}</div>' +
      '<div class="ht15" style="box-sizing:border-box; border-bottom:1px solid #000000;"></div>' +
      '<div class="ht20" style="box-sizing:border-box; border-bottom:1px solid #000000;">외래</div>' +
      '<div class="ht20e" style="box-sizing:border-box; border-bottom:1px solid #000000;"></div>' +
      '<div class="h10"></div>' +
      '<div class="ht10" style="height:66px; line-height:66px;">항목</div>' +
      '<div class="ht10" style="height:66px; line-height:66px;">일자</div>' +
      '<div class="ht6" style="height:66px; line-height:66px;">코드</div>' +
      '<div class="ht25" style="height:66px; line-height:66px;">명칭</div>' +
      '<div class="ht6" style="height:66px; line-height:66px;">금액</div>' +
      '<div class="ht3" style="height:66px; line-height:66px;">횟수</div>' +
      '<div class="ht3" style="height:66px; line-height:66px;">일수</div>' +
      '<div class="ht6" style="height:66px; line-height:66px;">총액</div>' +
      '<div class="ht24" style="height:66px;">' +
      '<span style="display:block; width:100%; height:22px; box-sizing:border-box; border-bottom:1px solid #000000;">급여</span>' +
      '<span style="display:block; float:left; width:70%; height:22px; box-sizing:border-box; border-bottom:1px solid #000000;">일부본인부담</span>' +
      '<span style="display:block; float:left; width:30%; height:44px; line-height:44px; letter-spacing:-1px; box-sizing:border-box; border-left:1px solid #000000; border-bottom:1px solid #000000;">전액본임부담</span>' +
      '<span style="display:block; float:left; width:35%; height:22px; margin-top:-22px; box-sizing:border-box; border-bottom:1px solid #000000;">본인부담금</span>' +
      '<span style="display:block; float:left; width:35%; height:22px; margin-left:35%; margin-top:-22px; box-sizing:border-box; border-left:1px solid #000000; border-bottom:1px solid #000000;">공단부담금</span>' +
      '</div>' +
      '<div class="ht7e" style="height:66px; line-height:66px;">비급여</div>' +
      '</div>' +
      '</header>' +
      '<section id="container" style="margin-top:217px;">' +
      '<div class="c_table">' +
      '{{item}}';

    var footer = '<footer id="footer">' +
      '<div class="f_info">' +
      '<span>신청인&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span>{{pat_nm}}</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(환자와의 관계 : </span><span>본인</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)의 요청에 따라</span><br />' +
      '<span>진료비 계산서·영수증 세부산정내역을 발급합니다<br /><span>{{currentYear}}년{{currentMonth}}월{{currentDay}}일</span>' +
      '</div>' +
      '<div class="f_infob">' +
      '<div class="fi20">요양기관 명칭</div>' +
      '<div class="fi40">{{hospital_name}}</div>' +
      '<div class="fi12">대표자</div>' +
      '<div class="fi8">유경하</div>' +
      '{{stamp}}' +
      '<div class="fi100">&nbsp;&nbsp;&nbsp;&nbsp;.1 .진료비 계산서·영수증의 세부내역서는 환자의 구체적인 처방 내역 등이 확인되므로 원칙적으로 환자 본인 외에 발급을 금합니다<br />' +
      '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;다만, 본 세부내역서 발급에 대해 별도로 환자 본인으로부터 위임을 받은 것이 확인된 자 또는 법정대리인에겐 발급이 가능합니다.<br />' +
      '&nbsp;&nbsp;&nbsp;&nbsp;.2 .비고란은 세부산정내역을 발부하는 영수증번호 등 요양기관이 필요한 경우 추가 기재하는 공간으로 활용할 수 있습니다<br />' +
      '&nbsp;&nbsp;&nbsp;&nbsp;.3 .동 서식에 명시된 항목은 「국민건강보험 요양급여의 기준에 관한 규칙」 제7조제3항에 따라 필수 기재되어야 합니다' +
      '</div>' +
      '</div>' +
      '</footer>';

    var qrFooter = '<div class="info" style="margin-top:-10px;">' +
      '</div>';

    var middleStr = '</div></section>';

    var currentDate = JSON.parse(pdfInfo)[0].orddate2;
    var str = '';

    var stamp = "";
    if(his_hsp_tp_cd == "02"){
      stamp = '<div class="fi20"><span class="stamp"></span></div>';
    }
    else{
      stamp = '<div class="fi20"><span class="stamp_seoul"></span></div>';
    }

    var no = 0;
    var num = 0;

    for (var i = 1; i < JSON.parse(pdfInfo).length + 1; i++) {

      num = num + 1;

      if (JSON.parse(pdfInfo)[i - 1].codename.replace(" ", "").includes("소 계:") == true) {
        if (i != JSON.parse(pdfInfo).length + 1) {
          if (JSON.parse(pdfInfo)[i].codename.replace(" ", "").includes("합계") == true) {
            num = num + 1;
          } else {
            num = num + 1;
          }
        }
      }

    }

    var elseNum = num % 27;
    var pageNum = num / 27;

    console.log("elseNum : " + elseNum);
    var html = fs.readFileSync(this.viewDir + 'eumc_jinryobisebuOut.html', 'utf8');

    var fromdate = JSON.parse(pdfInfo)[0].orddate2;
    var todate = JSON.parse(pdfInfo)[JSON.parse(pdfInfo).length - 1].orddate2;

    console.log("num : " + num);
    console.log("length : " + JSON.parse(pdfInfo).length);


    for (var i = 1; i < JSON.parse(pdfInfo).length + 1; i++) {

      console.log(" 아이 : " + i);
      // console.log("meddept : " + JSON.parse(pdfInfo)[i - 1]);
      // console.log("codename : " + JSON.parse(pdfInfo)[i - 1].codename);
      // console.log("codename : " + JSON.parse(pdfInfo)[i - 1].codename.replace(" ", ""));
      // console.log("codename.include : " + JSON.parse(pdfInfo)[i - 1].codename.replace(" ", "").includes("소 계:"));
      // console.log("codename.include : " + JSON.parse(pdfInfo)[i - 1].codename.replace(" ", "").includes("합계"));
      if (no == num) {
        if ((num % 27) < 21) {
          // console.log("========================================================");
          // console.log("============================1===========================");
          // console.log("========================================================");
        } else {
          // console.log("========================================================");
          // console.log("============================2===========================");
          // console.log("========================================================");
        }
      }

      if (i == 1) {
        str = str + '<div class="ct10" style="text-align:left;">&nbsp;' + JSON.parse(pdfInfo)[i - 1].orddate + '</div><div class="ct10" style="text-align:right;">&nbsp;' + JSON.parse(pdfInfo)[i - 1].pattype + '</div><div class="ct80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + JSON.parse(pdfInfo)[i - 1].meddept + '</div>';
        currentDate = JSON.parse(pdfInfo)[i - 1].orddate2;
        no = no + 1;
        // console.log(" 아이 : " + i);
        // console.log(" 엔오 : " + no);
        // console.log(" 넘 : " + num);
      }

      // console.log("no : " + no);

      if (JSON.parse(pdfInfo)[i - 1].codename.replace(" ", "").includes("소 계:")) {

        str = str + '<div class="ct10">&nbsp;' + JSON.parse(pdfInfo)[i - 1].codename + '</div><div class="ct10" style="text-align:right;">&nbsp;</div><div class="ct6" style="text-align:center;"></div><div class="ct25"></div><div class="ct6" style="text-align:right;"></div>' +
          '<div class="ct3"></div><div class="ct3"></div><div class="ct6" style="text-align:right;">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].sumprice1) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insamt) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insreq) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insall) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].uncamt) + '</div>';
        no = no + 1;
        // console.log("왜111");
        // console.log(" 아이 : " + i);
        // console.log(" 엔오 : " + no);
        // console.log(" 넘 : " + num);

        if (num > 27) {
          if (no == 27) {
            html_ = html.replace("{{item}}", str);
            html = html_ + middleStr + qrFooter + header;
            str = "";
          } else if (no % 27 == 0 && no !== 0 && no !== 27 && no != num) {
            html_ = html.replace("{{item}}", str);
            html = html_ + middleStr + qrFooter + header;
            str = "";
          } else if (no == num) {
            if ((no % 27) < 21) {
              html_ = html.replace("{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            } else {
              var elseNum = 27 - (no % 27);
              for (var j = 0; j < elseNum; j++) {
                str = str + '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
              }
              html_ = html.replace("{{item}}", str);
              html = html_ + middleStr + qrFooter + header + middleStr + footer + qrFooter;
              str = "";
            }
          }
        } else {
          if (num < 24) {
            if (no == num) {
              html_ = html.replace("{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            }
          } else {
            if (no == 21 && no !== num) {
              html_ = html.replace("{{item}}", str);
              html = html_ +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
              html = html + middleStr + qrFooter + header;
              str = "";
            } else if (no == num) {
              html_ = html.replace("{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            }
          }
        }

        if (no != num) {
          if (JSON.parse(pdfInfo)[i].codename.replace(" ", "").includes("합계")) {

            str = str + '<div class="ct10">&nbsp;' + JSON.parse(pdfInfo)[i].codename + '</div><div class="ct10" style="text-align:right;">&nbsp;</div><div class="ct6" style="text-align:center;"></div><div class="ct25"></div><div class="ct6" style="text-align:right;"></div>' +
              '<div class="ct3"></div><div class="ct3"></div><div class="ct6" style="text-align:right;">' + this.numberWithCommas(JSON.parse(pdfInfo)[i].sumprice1) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i].insamt) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i].insreq) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i].insall) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i].uncamt) + '</div>';
            no = no + 1;
            // console.log("왜222");
            // console.log(" 아이 : " + i);
            // console.log(" 엔오 : " + no);
            // console.log(" 넘 : " + num);

            if (num > 27) {
              if (no == 27) {
                html_ = html.replace("{{item}}", str);
                html = html_ + middleStr + qrFooter + header;
                str = "";
              } else if (no % 27 == 0 && no !== 0 && no !== 27 && no != num) {
                html_ = html.replace("{{item}}", str);
                html = html_ + middleStr + qrFooter + header;
                str = "";
              } else if (no == num) {
                if ((no % 27) < 21) {
                  html_ = html.replace("{{item}}", str);
                  html = html_ + middleStr + footer + qrFooter;
                  str = "";
                } else {
                  var elseNum = 27 - (no % 27);
                  for (var j = 0; j < elseNum; j++) {
                    str = str + '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                  }
                  html_ = html.replace("{{item}}", str);
                  html = html_ + middleStr + qrFooter + header + middleStr + footer + qrFooter;
                  str = "";
                }
              }
            } else {
              if (num < 24) {
                if (no == num) {
                  html_ = html.replace("{{item}}", str);
                  html = html_ + middleStr + footer + qrFooter;
                  str = "";
                }
              } else {
                if (no == 21 && no !== num) {
                  html_ = html.replace("{{item}}", str);
                  html = html_ +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                    '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                  html = html + middleStr + qrFooter + header;
                  str = "";
                } else if (no == num) {
                  html_ = html.replace("{{item}}", str);
                  html = html_ + middleStr + footer + qrFooter;
                  str = "";
                }
              }
            }

            i = i + 1;

            if (no != num) {

              str = str + '<div class="ct10" style="text-align:left;">&nbsp;' + this.date_to_str(JSON.parse(pdfInfo)[i - 1].orddate2, "-") + '</div><div class="ct10" style="text-align:right;">&nbsp;' + JSON.parse(pdfInfo)[i].pattype + '</div><div class="ct80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + JSON.parse(pdfInfo)[i].meddept + '</div>';
              no = no + 1;
              // console.log("왜333");
              // console.log(" 아이 : " + i);
              // console.log(" 엔오 : " + no);
              // console.log(" 넘 : " + num);


              if (num > 27) {
                if (no == 27) {
                  html_ = html.replace("{{item}}", str);
                  html = html_ + middleStr + qrFooter + header;
                  str = "";
                } else if (no % 27 == 0 && no !== 0 && no !== 27 && no != num) {
                  html_ = html.replace("{{item}}", str);
                  html = html_ + middleStr + qrFooter + header;
                  str = "";
                } else if (no == num) {
                  if ((no % 27) < 21) {
                    html_ = html.replace("{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  } else {
                    var elseNum = 27 - (no % 27);
                    for (var j = 0; j < elseNum; j++) {
                      str = str + '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                    }
                    html_ = html.replace("{{item}}", str);
                    html = html_ + middleStr + qrFooter + header + middleStr + footer + qrFooter;
                    str = "";
                  }
                }
              } else {
                if (num < 24) {
                  if (no == num) {
                    html_ = html.replace("{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  }
                } else {
                  if (no == 21 && no !== num) {
                    html_ = html.replace("{{item}}", str);
                    html = html_ +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                    html = html + middleStr + qrFooter + header;
                    str = "";
                  } else if (no == num) {
                    html_ = html.replace("{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  }
                }
              }
            }

          } else {
            if (no != num) {

              str = str + '<div class="ct10" style="text-align:left;">&nbsp;' + this.date_to_str(JSON.parse(pdfInfo)[i - 1].orddate2, "-") + '</div><div class="ct10" style="text-align:right;">&nbsp;' + JSON.parse(pdfInfo)[i].pattype + '</div><div class="ct80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + JSON.parse(pdfInfo)[i].meddept + '</div>';
              currentDate = JSON.parse(pdfInfo)[i].orddate2;
              no = no + 1;
              // console.log("왜444");
              // console.log(" 아이 : " + i);
              // console.log(" 엔오 : " + no);
              // console.log(" 넘 : " + num);


              if (num > 27) {
                if (no == 27) {
                  html_ = html.replace("{{item}}", str);
                  html = html_ + middleStr + qrFooter + header;
                  str = "";
                } else if (no % 27 == 0 && no !== 0 && no !== 27 && no != num) {
                  html_ = html.replace("{{item}}", str);
                  html = html_ + middleStr + qrFooter + header;
                  str = "";
                } else if (no == num) {
                  if ((no % 27) < 21) {
                    html_ = html.replace("{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  } else {
                    var elseNum = 27 - (no % 27);
                    for (var j = 0; j < elseNum; j++) {
                      str = str + '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                    }
                    html_ = html.replace("{{item}}", str);
                    html = html_ + middleStr + qrFooter + header + middleStr + footer + qrFooter;
                    str = "";
                  }
                }
              } else {
                if (num < 24) {
                  if (no == num) {
                    html_ = html.replace("{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  }
                } else {
                  if (no == 21 && no !== num) {
                    html_ = html.replace("{{item}}", str);
                    html = html_ +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                      '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
                    html = html + middleStr + qrFooter + header;
                    str = "";
                  } else if (no == num) {
                    html_ = html.replace("{{item}}", str);
                    html = html_ + middleStr + footer + qrFooter;
                    str = "";
                  }
                }
              }

            }
          }
        }
      } else {
        str = str + '<div class="ct10">&nbsp;' + JSON.parse(pdfInfo)[i - 1].codename + '</div><div class="ct10" style="text-align:right;">&nbsp;' + this.date_to_str(JSON.parse(pdfInfo)[i - 1].orddate2, "/") + '</div><div class="ct6" style="text-align:center;">' + JSON.parse(pdfInfo)[i - 1].edicode + '</div><div class="ct25">' + JSON.parse(pdfInfo)[i - 1].korname + '</div><div class="ct6" style="text-align:right;">' + JSON.parse(pdfInfo)[i - 1].price + '</div>' +
          '<div class="ct3">' + JSON.parse(pdfInfo)[i - 1].useqty + '</div><div class="ct3">' + JSON.parse(pdfInfo)[i - 1].useday + '</div><div class="ct6" style="text-align:right;">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].sumprice1) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insamt) + '</div><div class="ct8">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insreq) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].insall) + '</div><div class="ct7">' + this.numberWithCommas(JSON.parse(pdfInfo)[i - 1].uncamt) + '</div>';
        no = no + 1;


        // console.log("왜555");
        // console.log(" 아이 : " + i);
        // console.log(" 엔오 : " + no);
        // console.log(" 넘 : " + num);

        if (num > 27) {
          if (no == 27) {
            html_ = html.replace("{{item}}", str);
            html = html_ + middleStr + qrFooter + header;
            str = "";
          } else if (no % 27 == 0 && no !== 0 && no !== 27 && no != num) {
            html_ = html.replace("{{item}}", str);
            html = html_ + middleStr + qrFooter + header;
            str = "";
          } else if (no == num) {
            if ((no % 27) < 21) {
              html_ = html.replace("{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            } else {
              var elseNum = 27 - (no % 27);
              for (var j = 0; j < elseNum; j++) {
                str = str + '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
              }
              html_ = html.replace("{{item}}", str);
              html = html_ + middleStr + qrFooter + header + middleStr + footer + qrFooter;
              str = "";
            }
          }
        } else {
          if (num < 24) {
            if (no == num) {
              html_ = html.replace("{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            }
          } else {
            if (no == 21 && no !== num) {
              html_ = html.replace("{{item}}", str);
              html = html_ +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>' +
                '<div class="ct10" style="text-align:left;"></div><div class="ct10" style="text-align:right;"></div><div class="ct80"></div>';
              html = html + middleStr + qrFooter + header;
              str = "";
            } else if (no == num) {
              html_ = html.replace("{{item}}", str);
              html = html_ + middleStr + footer + qrFooter;
              str = "";
            }
          }
        }
      }

    }


    html = html + '</div></body></html>';


    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    var dd_str = '';
    var mm_str = '';

    if (dd < 10) {
      dd_str = '0' + dd;
    }else{
      dd_str = '' + dd;
    }

    if (mm < 10) {
      mm_str = '0' + mm;
    }else{
      mm_str = '' + mm;
    }

   html = html.replace('{{currentYear}}', yyyy+'');
   html = html.replace( '{{currentMonth}}', mm_str);
   html = html.replace( '{{currentDay}}', dd_str);
   html = html.replace( '{{pat_nm}}', pat_nm);
   html = html.replace( '{{pat_no}}', pat_no);
   html = html.replace( '{{fileCode}}', fileCode);
   html = html.replace( '{{qrName}}', qrName);
   html = html.replace( '{{fromdate}}', this.date_to_str(fromdate, "-"));
   html = html.replace( '{{todate}}', this.date_to_str(todate, "-"));
   html = html.replace('undefined', "");
   html = html.replace( '{{qrName}}', qrName);
   html = html.replace( '{{hospital_name}}', hospital_name);
   html = html.replace( '{{stamp}}', stamp);

    var jsreport = require('jsreport-core')();
    jsreport.use(require('jsreport-chrome-pdf')({ launchOptions: { args: [ '--no-sandbox', '--disable-setuid-sandbox'] } }))
    jsreport.use(require('jsreport-handlebars')());
    jsreport.use(require('jsreport-pdf-utils')());


    console.log("만들기 시작");

    return jsreport.init().then(() => {
      return jsreport.render({
        template: {
          content: html,
          recipe: 'chrome-pdf',
          engine: 'handlebars',
          displayHeaderFooter: true,
          pdfPassword: {
            active: true,
            password: password,
            /* ...other options... */
          },
          launchOptions: {
            // Landscape: true,
            // printBackground: true
          },
          chrome: {
            landscape: true,
            printBackground: true,
            format: 'A4'
          }
        },
        data: {
          foo: "world"
        },

      }).then((resp) => {
        // prints pdf with headline Hello world
        console.log("중간이다.");

        var filePath = this.dir + fileName + ".pdf";
        resp.result.pipe(fs.createWriteStream(filePath));
        // console.log(resp.content.toString());
        return filePath;
      });
    }).catch((e) => {
      console.error(e);
    });
  }

  async billInfo(body){
    var html;
    var options;

    var fileCode = body.fileCode;
    var fileName = body.fileName;
    var pdfInfo = body.pdfInfo;
    var pat_no = body.pat_no;
    var pat_nm = body.pat_nm;
    var qrName = body.qrName;
    var password = body.password;
    var rcptype = body.rcptype;

    console.log("========= 진료비 영수증 데이타 ========");
    console.log("fileCode : " + fileCode);
    console.log("fileName : " + fileName);
    console.log("pat_nm : " + pat_nm);
    console.log("pdfInfo : " + pdfInfo);
    console.log("pat_no : " + pat_no);
    console.log("pat_nm : " + pat_nm);
    console.log("qrName : " + qrName);
    console.log("password : " + password);
    console.log("==================================");

    var his_hsp_tp_cd = body.his_hsp_tp_cd;  // 병원코드
    var table0 = pdfInfo.Table0;  // Table0 배열
    var table01 = pdfInfo.Table01;  // Table1
    var table02 = pdfInfo.Table02;  // Table0 배열
    var table03 = pdfInfo.Table03;  // Table0 배열

    console.log("==================================");
    console.log("Table0 : " +  JSON.stringify(table0 ));
    console.log("Table01 : " + JSON.stringify(table01));
    console.log("Table02 : " + JSON.stringify(table02));
    console.log("Table03 : " + JSON.stringify(table03));
    console.log("==================================");

    var job = new Object();

    console.log("his_hsp_tp_cd : " + his_hsp_tp_cd);

// console.log("=============table3==============");
// var NXT_PRGR_DEPT_CD_RNK = JSON.parse(table0).NXT_PRGR_DEPT_CD_RNK;
// var NXT_PRGR_DEPT_CD = JSON.parse(table0).NXT_PRGR_DEPT_CD;
// var DEPT_FLR_TP_CD = JSON.parse(table0).DEPT_FLR_TP_CD;
// console.log("==================================");


    var resultCode = "0000";
    html = fs.readFileSync(this.viewDir + 'eumc_receipt.html', 'utf8')
    // console.log(html)
// options = {format: 'A3', orientation: 'landscape', timeout: '100000'};
// pdf.create(html, options).toFile(dir + fileName + '.pdf', function (err, response) {
//     if (err) {
//         resultCode = "2222";
//         return console.log(err);
//     }
//     res.send(resultCode); // { filename: '/app/businesscard.pdf' }
// });

    if (rcptype == '1') {
      html = html.replace('{{RCP_TYPE}}',
        '<div style=\"position:absolute; left:240px; width:20px; height:20px; font-size:16px; font-weight:bold;\">√</div>' +
        '<div style=\"position:absolute; left:315px; width:20px; height:20px; font-size:16px; font-weight:bold;\"></div>' +
        '<div style=\"position:absolute; left:385px; width:20px; height:20px; font-size:16px; font-weight:bold;\"></div>' +
        '<div style=\"position:absolute; left:441px; width:20px; height:20px; font-size:16px; font-weight:bold;\"></div>');

    } else if (rcptype == '2') {
      html = html.replace('{{RCP_TYPE}}',
        '<div style=\"position:absolute; left:240px; width:20px; height:20px; font-size:16px; font-weight:bold;\"></div>' +
        '<div style=\"position:absolute; left:315px; width:20px; height:20px; font-size:16px; font-weight:bold;\">√</div>' +
        '<div style=\"position:absolute; left:385px; width:20px; height:20px; font-size:16px; font-weight:bold;\"></div>' +
        '<div style=\"position:absolute; left:441px; width:20px; height:20px; font-size:16px; font-weight:bold;\">√</div>');

    } else {
      html = html.replace('{{RCP_TYPE}}',
        '<div style=\"position:absolute; left:240px; width:20px; height:20px; font-size:16px; font-weight:bold;\"></div>' +
        '<div style=\"position:absolute; left:315px; width:20px; height:20px; font-size:16px; font-weight:bold;\">√</div>' +
        '<div style=\"position:absolute; left:385px; width:20px; height:20px; font-size:16px; font-weight:bold;\">√</div>' +
        '<div style=\"position:absolute; left:441px; width:20px; height:20px; font-size:16px; font-weight:bold;\"></div>');


    }


    if (table0 != null) {
      for (var i = 0; i < table0.length; i++) {

        var num = i + 1;

        if (table0[i].INSOWN != "0") {
          html = html.replace('{{INSOWN_' + num + '}}', this.editCommaAndZero(table0[i].INSOWN));
        } else {
          html = html.replace('{{INSOWN_' + num + '}}', "");
        }

        if (table0[i].INSREQ != "0") {
          html = html.replace('{{INSREQ_' + num + '}}', this.editCommaAndZero(table0[i].INSREQ));
        } else {
          html = html.replace('{{INSREQ_' + num + '}}', "");
        }

        if (table0[i].INSALL != "0") {
          html = html.replace('{{INSALL_' + num + '}}', this.editCommaAndZero(table0[i].INSALL));
        } else {
          html = html.replace('{{INSALL_' + num + '}}', "");
        }

        if (table0[i].SPC != "0") {
          html = html.replace('{{SPC_' + num + '}}', this.editCommaAndZero(table0[i].SPC));
        } else {
          html = html.replace('{{SPC_' + num + '}}', "");
        }

        if (table0[i].UIN != "0") {
          html = html.replace('{{UIN_' + num + '}}', this.editCommaAndZero(table0[i].UIN));
        } else {
          html = html.replace('{{UIN_' + num + '}}', "");
        }

        console.log('{{INSOWN_' + num + '}} : ' + table0[i].INSOWN);
        console.log('{{INSREQ_' + num + '}} : ' + table0[i].INSREQ);
        console.log('{{INSALL_' + num + '}} : ' + table0[i].INSALL);
        console.log('{{SPC_' + num + '}}    : ' + table0[i].SPC);
        console.log('{{UIN_' + num + '}}    : ' + table0[i].UIN);

      }

    }
    if (table01 != null && typeof(table01) != 'undefined') {
      html = html.replace('{{NXT_PRGR_DEPT_CD}}', table01.NXT_PRGR_DEPT_CD);
    }


    if (table03 != null) {
      if (table03.OUT_CASH != null) {

        var cashOutArr = table03.OUT_CASH.split('|');
        if (cashOutArr[2] != null) {
          html = html.replace('{{OUT_CASH3}}', cashOutArr[2]);
        }
        if (cashOutArr[4] != null) {
          html = html.replace('{{OUT_CASH5}}', cashOutArr[4]);
        }
        if (cashOutArr[5] != null) {
          html = html.replace('{{OUT_CASH6}}', cashOutArr[5]);
        }
      }


      html = html.replace('{{OUT_MEDDATE}}', table03.OUT_MEDDATE);


      // 중간비 영수증 정보에는 진료의 정보가 없음
      if (rcptype == 2) {
        html = html.replace('{{OUT_DEPTNAME}}', table03.OUT_DEPTNAME);
      } else {
        html = html.replace('{{OUT_DEPTNAME}}', table03.OUT_DEPTNAME + " / " + table03.OUT_DRNAME);
      }
      // html = html.replace('{{OUT_DEPTNAME}}', table03.OUT_DEPTNAME);
      // html = html.replace('{{OUT_DRNAME}}', table03.OUT_DRNAME);

      html = html.replace('{{OUT_PME_CLS_CD}}', table03.OUT_PME_CLS_CD);
      html = html.replace('{{OUT_PSE_CLS_CD}}', table03.OUT_PSE_CLS_CD);
      html = html.replace('{{OUT_CITIZEN}}', table03.OUT_CITIZEN);

      if (table03.OUT_RPY_DT != null) {
        html = html.replace('{{currentYear}}', table03.OUT_RPY_DT.substring(0, 4));
        html = html.replace('{{currentMonth}}', table03.OUT_RPY_DT.substring(4, 6));
        html = html.replace('{{currentDay}}', table03.OUT_RPY_DT.substring(6, 8));
      }

      if (table03.OUT_MTCS_AMT != null) {
        html = html.replace('{{OUT_MTCS_AMT}}', this.editCommaAndZero(table03.OUT_MTCS_AMT));
        console.log('table03.OUT_MTCS_AMT : ' + table03.OUT_MTCS_AMT);
      }
      if (table03.OUT_PBDN_AMT != null) {
        html = html.replace('{{OUT_PBDN_AMT}}', this.editCommaAndZero(table03.OUT_PBDN_AMT));
        console.log('table03.OUT_PBDN_AMT : ' + table03.OUT_PBDN_AMT);
      }
      if (table03.OUT_CARD_RPY_AMT != null) {
        html = html.replace('{{OUT_CARD_RPY_AMT}}', this.editCommaAndZero(table03.OUT_CARD_RPY_AMT));
        console.log('table03.OUT_MTCS_AMT : ' + table03.OUT_CARD_RPY_AMT);
      }
      if (table03.OUT_CARD != null) {
        html = html.replace('{{OUT_CARD}}', table03.OUT_CARD);
        console.log('table03.OUT_CARD : ' + table03.OUT_CARD);
      }
      if (table03.OUT_WARDNO != null) {
        html = html.replace('{{OUT_WARDNO}}', this.editCommaAndZero(table03.OUT_WARDNO));
        console.log('table03.OUT_WARDNO : ' + table03.OUT_WARDNO);
      }
      if (table03.OUT_RPY_AMT != null) {
        html = html.replace('{{OUT_RPY_AMT}}', this.editCommaAndZero(table03.OUT_RPY_AMT));
        console.log('table03.OUT_RPY_AMT : ' + table03.OUT_RPY_AMT);
      }
      if (table03.OUT_SPCPBDN_AMT != null) {
        html = html.replace('{{OUT_SPCPBDN_AMT}}', this.editCommaAndZero(table03.OUT_SPCPBDN_AMT));
        console.log('table03.OUT_SPCPBDN_AMT : ' + table03.OUT_SPCPBDN_AMT);
      }
      html = html.replace('{{OUT_GRPAMT}}', table03.OUT_GRPAMT);
      if(table03.OUT_RDTN_AMT == '0'){
        html = html.replace('{{OUT_RDTN_AMT_CAPTION}}', "");
        html = html.replace('{{OUT_RDTN_AMT}}', "");
      }
      else{
        html = html.replace('{{OUT_RDTN_AMT_CAPTION}}', "감면금액(D)");
        html = html.replace('{{OUT_RDTN_AMT}}', this.editCommaAndZero(table03.OUT_RDTN_AMT));
        console.log('table03.OUT_RDTN_AMT : ' + table03.OUT_RDTN_AMT);
      }
      if (table03.OUT_PV_RPY_AMT != null) {
        html = html.replace('{{OUT_PV_RPY_AMT}}', this.editCommaAndZero(table03.OUT_PV_RPY_AMT));
        console.log('table03.OUT_PV_RPY_AMT : ' + table03.OUT_PV_RPY_AMT);
      }

      if (table03.OUT_SPCPBDN_AMT != null) {
        html = html.replace('{{OUT_SPCPBDN_AMT}}', this.editCommaAndZero(table03.OUT_SPCPBDN_AMT));
        console.log('table03.OUT_SPCPBDN_AMT : ' + table03.OUT_SPCPBDN_AMT);
      }
      if (table03.OUT_UNCL_AMT != null) {
        html = html.replace('{{OUT_UNCL_AMT}}', this.editCommaAndZero(table03.OUT_UNCL_AMT));
        console.log('table03.OUT_UNCL_AMT : ' + table03.OUT_UNCL_AMT);
      }
      html = html.replace('{{OUT_EXDOSNO}}', table03.OUT_EXDOSNO);
      html = html.replace('{{OUT_RCORG_GRD_NM}}', table03.OUT_RCORG_GRD_NM);
      if (table03.OUT_DOSNO != null) {
        if (table03.OUT_DOSNO.substring(0, 5) != 0) {
          html = html.replace('{{OUT_DOSNO05}}', table03.OUT_DOSNO.substring(0, 5));
        }
      } else {
        html = html.replace('{{OUT_DOSNO05}}', "");
      }
      if(table03.OUT_CON_INF != null){
        html = html.replace('{{OUT_CON_INF}}', table03.OUT_CON_INF);
      }

    }
    html = html.replace('{{pat_no}}', pat_no);
    html = html.replace('{{pat_nm}}', pat_nm);
    html = html.replace('{{qrName}}', qrName);
    html = html.replace('{{fileCode}}', fileCode);

    if (table03.OUT_SPCYN == 'Y') {
      html = html.replace('{{OUT_SPCYN}}',
        '<div style="position:absolute; left:579px; top:613px; height:20px; font-size:11px;">√</div>' +
        '<div style="position:absolute; left:629px; top:613px; height:20px; font-size:11px;"></div>');

    } else if (table03.OUT_SPCYN == 'N') {
      html = html.replace('{{OUT_SPCYN}}',
        '<div style="position:absolute; left:579px; top:613px; height:20px; font-size:11px;"></div>' +
        '<div style="position:absolute; left:629px; top:613px; height:20px; font-size:11px;">√</div>');

    }

    if (his_hsp_tp_cd == '02') {
      //목동
      html = html.replace('{{seal}}', 'seal');
      html = html.replace('{{businessNumber}}', '1178201074');
      html = html.replace('{{yoyangNumber}}', '1110915');
      html = html.replace('{{hosName}}', '이화여자대학교 의과대학부속 목동병원');
      html = html.replace('{{callNumber}}', '1666-5000');
      html = html.replace('{{address}}', '서울시 양천구 안양천로 1071(목동)');
      html = html.replace('{{hospitalName}}', '목동');
      html = html.replace('{{hospitalNameTop}}', '이대목동병원');
      html = html.replace('{{hospitalType}}','상급종합병원');
    } else {
      //서울
      html = html.replace('{{seal}}', 's_seal');
      html = html.replace('{{businessNumber}}', '3668200250');
      html = html.replace('{{yoyangNumber}}', '11101369');
      html = html.replace('{{hosName}}', '이화여자대학교 의과대학부속 서울병원');
      html = html.replace('{{callNumber}}', '1522-7000');
      html = html.replace('{{address}}', '서울특별시 강서구 공항대로 260(마곡동)');
      html = html.replace('{{hospitalName}}', '서울');
      html = html.replace('{{hospitalNameTop}}', '이대서울병원');
      html = html.replace('{{hospitalType}}','종합병원');
    }

    // if (table02 === null) {
    //     html = html.replace('{{MED_RSV_DTM_1}}', "");
    // } else {
    //     if (typeof table02 !== 'undefined') {
    //         html = html.replace('{{MED_RSV_DTM_1}}', "");
    //     } else {
    //         html = html.replace('{{MED_RSV_DTM_1}}', Table02.MED_RSV_DTM_1.substring(1, 16) + Table02.DRNAME + Table02.DEPT_NM);
    //     }
    // }

    if (table02 != null) {
      for (var i = 0; i < table02.length; i++) {

        var num = i + 1;

        if (table02[i].MED_RSV_DTM != null) {
          html = html.replace('{{MED_RSV_' + num + '}}', table02[i].MED_RSV_DTM.substring(0, 16) + table02[i].DEPT_NM + " " + table02[i].DRNAME);
        }
      }

    }

    var jsreport = require('jsreport-core')();
    jsreport.use(require('jsreport-chrome-pdf')({ launchOptions: { args: [ '--no-sandbox', '--disable-setuid-sandbox'] } }))
    jsreport.use(require('jsreport-handlebars')());
    jsreport.use(require('jsreport-pdf-utils')());

    return jsreport.init().then(() => {
      return jsreport.render({
        template: {
          content: html,
          recipe: 'chrome-pdf',
          engine: 'handlebars',
          isOperational: true,
          weak: true,
          logged: true,
          displayHeaderFooter: true,
          pdfPassword: {
            active: true,
            password: password,
            /* ...other options... */
          },
          launchOptions: {
            // Landscape: true,
            // printBackground: true
          },
          chrome: {
            landscape: true,
            printBackground: true,
            format: 'A4'
          }
        },
        data: {
          foo: "world"
        },

      }).then((resp) => {
        // prints pdf with headline Hello world
        console.log("중간이다.");


        var filePath = this.dir + fileName + ".pdf";
        resp.result.pipe(fs.createWriteStream(filePath));
        // console.log(resp.content.toString());
        return filePath;
      });
    }).catch((e) => {
      console.error(e);
    });
  }



}
