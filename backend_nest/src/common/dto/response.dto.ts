import { ResultData, ApiResult } from '../../const/api-result.const';

export class ResponseDto {
  resultCode: string;
  resultMsg: string;
  error: any;
  ok = true;
  data: any;

  private setResult(resultData: ResultData) {
    this.resultCode = resultData.code;
    this.resultMsg = resultData.desc;
  }

  setSuccess(data: any, desc?: string) {
    this.ok = true;
    this.data = data;
    if (desc != null) {
      this.setResult(new ResultData(ApiResult.RESULT_OK.code, desc));
    } else {
      this.setResult(ApiResult.RESULT_OK);
    }

    return this;
  }

  setError(errType: ResultData, error?: any) {
    this.ok = false;
    this.setResult(errType);
    this.error = error;
    return this;
  }

  setErrorWithMsg(errType: ResultData, msg: string, error?: any) {
    this.ok = false;
    this.setResult(errType);
    this.error = error;
    this.resultMsg = msg;
    return this;
  }

  toString() {
    return JSON.stringify(this);
  }

}
