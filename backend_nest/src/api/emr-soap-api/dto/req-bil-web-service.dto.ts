import { Logger } from "@nestjs/common";
import { KioskServiceCodeConst } from "../../../const/kiosk-service-code.const";

export class ReqBilWebService {
  private readonly logger = new Logger(ReqBilWebService.name);

  sGubun: string;
  sParam: string;


  constructor(serviceId: KioskServiceCodeConst, paramArr: Array<string>) {
    this.sGubun = serviceId;
    this.sParam = this.convertParamToXmlStr(serviceId, paramArr);
  }



  private convertParamToXmlStr(serviceId: string, paramArr: Array<string>) {
    this.logger.debug(`sParam 변환 START : ${serviceId} - ${paramArr.toString()}`);
    /**
     *  sb.append("<?xml version='1.0' encoding='UTF-8'?>");
     *  sb.append("<ROOT><Table>");
     *  sb.append("<QID><![CDATA[" + iService + "]]></QID>");
     *  sb.append("<QTYPE><![CDATA[Package]]></QTYPE>");
     *  sb.append("<USERID><![CDATA[BIA]]></USERID>");
     *  sb.append("<EXECTYPE><![CDATA[FILL]]></EXECTYPE>");
     *  for(int i = 0; i < datas.length; i++){
     *      if(datas[i] == null  || datas[i].equals("null")) datas[i] = "";
     *      sb.append("<P" + i + "><![CDATA[" + datas[i] + "]]></P" + i + ">");
     *  }
     *  sb.append("</Table></ROOT>");
     */


    let xml = `<?xml version='1.0' encoding='UTF-8'?><ROOT><Table><QID><![CDATA[${serviceId}]]></QID><QTYPE><![CDATA[Package]]></QTYPE><USERID><![CDATA[BIA]]></USERID><EXECTYPE><![CDATA[FILL]]></EXECTYPE>`;

    for(var i = 0 ; i < paramArr.length; i++) {
      if(paramArr[i] == null || paramArr[i] == 'null' || typeof(paramArr[i]) == 'undefined' || paramArr[i] == '') paramArr[i] = '';
      xml += "<P" + i + "><![CDATA[" + paramArr[i] + "]]></P" + i + ">";
    }

    xml += `</Table></ROOT>`;

    this.logger.debug(`sParam 변환 END : ${xml}`);
    return xml;
  }




}
