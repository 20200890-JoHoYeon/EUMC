import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('eumc_pay', { database: 'eumc_relay' })
export class EumcPayEumcEntity {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column({ name: 'batchkey', nullable: false, length: 100 })
  batchkey: string;

  @Column({  name: 'cardname', nullable: false, length: 45 })
  cardname: string;

  @Column({  name: 'password', nullable: true, length: 100 })
  password: string;

  @Column({  name: 'userKey', nullable: true, length: 100 })
  userKey: string;

  @Column({  name: 'patno', nullable: true, length: 50 })
  patno: string;

  @Column({  name: 'his_hsp_tp_cd', nullable: false, length: 100 })
  his_hsp_tp_cd: string;

  @Column({  name: 'delyn', nullable: true, length: 10, default: 'N' })
  delyn: string;

  @Column({  name: 'regdate', nullable: true, default: () => 'now()'})
  regdate: Date;

  @Column({  name: 'deldate', nullable: false})
  deldate: string;

}
