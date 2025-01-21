import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('eumc_alimtalk', { database: 'eumc_relay' })
export class EumcAlimtalkEumcEntity {
  @PrimaryColumn()
  user_Key: string;

  @Column({ name: 'his_hsp_tp_cd', nullable: false, length: 10 })
  his_hsp_tp_cd: string;

  @Column({  name: 'pt_no', nullable: false, length: 100 })
  pt_no: string;

  @Column({  name: 'pt_name', nullable: false, length: 100 })
  pt_name: string;

  @Column({  name: 'meddate', nullable: false, length: 100 })
  meddate: string;

  @Column({  name: 'dept_cd', nullable: false, length: 100 })
  dept_cd: string;

  @Column({  name: 'dept_name', nullable: false, length: 50 })
  dept_name: string;

  @Column({  name: 'rcp_type', nullable: false, length: 100 })
  rcp_type: string;

  @Column({  name: 'phone_no', nullable: false, length: 100 })
  phone_no: string;

  @Column({  name: 'reg_date', nullable: false, length: 100 })
  reg_date: string;

  @Column({  name: 'reg_time', nullable: false, length: 100 })
  reg_time: string;
}

