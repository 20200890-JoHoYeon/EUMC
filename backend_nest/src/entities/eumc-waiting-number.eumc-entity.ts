import { Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('eumc_w_number', { database: 'eumc_relay' })
export class EumcWaitingNumberEumcEntity {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column({ nullable: false, length: 2 })
  hsp_tp_cd: string;

  @Column({ nullable: false, length: 20 })
  kioskIp: string;

  @Column({ nullable: false })
  menu: string;

  @Column({ nullable: false })
  callNo: number;

  @Column({ nullable: false })
  status: number;

  @Column({ nullable: false, length: 10 })
  patno: string;

  @Column({ nullable: true, default: () => 'now()'})
  regDate: Date;

  @Column({ nullable: true })
  callDate: Date;
}
