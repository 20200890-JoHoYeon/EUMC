import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as QRCode from "qrcode";


@Injectable()
export class ImgUtil {

  constructor(private readonly configService: ConfigService) {
  }

  public generateQRCodeImage = async function(text: string, filePath: string){
    // QRCode.toDataURL(text, { errorCorrectionLevel: 'H' }, function (err, url) {
    //   console.log(url)
    // })
    return await QRCode.toFile(
      filePath,
      text
    )
  }




}
