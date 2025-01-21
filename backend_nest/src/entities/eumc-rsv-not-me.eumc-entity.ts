import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('eumc_rsv_not_me', { database: 'eumc_relay' })
export class EumcRsvNotMeEumcEntity {
  @PrimaryGeneratedColumn()
  // @Column({length: 255})
  seq: number;

  @Column({ name: 'hsp_tp_cd', nullable: false, length: 2 })
  hspTpCd: string;

  @Column({  name: 'app_patno', nullable: false, length: 10 })
  appPatno: string;

  @Column({  name: 'rsv_patno', nullable: false, length: 10 })
  rsvPatno: string;

  @Column({  name: 'rsv_date', nullable: true})
  rsvDate: number;

  @Column({  name: 'rsv_time', nullable: true})
  rsvTime: number;
}

