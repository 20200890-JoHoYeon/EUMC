export class WaitingNumber {
  kioskIp: string;
  menu: number;
  locationName: string;
  waitingCount: number;
  myNumber: number;

  constructor(
    kiosk_ip: string,
    memu: number,
    location_name: string,
    waiting_count: number,
  ) {
    this.kioskIp = kiosk_ip;
    this.menu = memu;
    this.locationName = location_name;
    this.waitingCount = waiting_count;
    this.myNumber = -1;
  }
}
