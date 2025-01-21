export interface PatientCallData {
  SYSTEM: number;
  CMD: string;
  K_IP: string;
  MENU: number;
  PATIENT: number;
  STATUS: number;
  CALL_NO?: number;
  DESK?: number;
  DEPT?: number;
}
// ONESIGNAL RESP JSON
// {"SYSTEM":1,"CMD":"CALL2", "K_IP":"10.10.210.66", "MENU":1, "PATIENT":12009954, "CALL_NO":291, "DESK":22}
