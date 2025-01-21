import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('eumc_cert', { database: 'eumc_relay' })
export class EumcCertEumcEntity {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column({ name: 'file_code', nullable: false, length: 20 })
  file_code: string;

  @Column({  name: 'cert_type', nullable: false, length: 20 })
  cert_type: string;

  @Column({  name: 'data', nullable: false })
  data: string;

  @Column({  name: 'c_date', nullable: true, default: () => 'now()'})
  c_date: Date;
}

