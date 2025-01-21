import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('eumc_kakaopay', { database: 'eumc_relay' })
export class EumcKakaopayEumcEntity {
  @PrimaryGeneratedColumn()
  seq: number;

  @Column({ name: 'tid', nullable: false, length: 50 })
  tid: string;

  @Column({ name: 'cid', nullable: false, length: 50 })
  cid: string;

  @Column({ name: 'partner_order_id', nullable: false, length: 50 })
  partner_order_id: string;

  @Column({  name: 'payment_method_type', nullable: false, length: 20 })
  payment_method_type: string;

  @Column({  name: 'item_name', nullable: false, length: 50 })
  item_name: string;

  @Column({  name: 'item_code', nullable: false, length: 50 })
  item_code: string;

  @Column({  name: 'approved_at', nullable: false, length: 50 })
  approved_at: string;

  @Column({  name: 'amount', nullable: false, length: 50, default: '0' })
  amount: string;

  @Column({  name: 'tax_free', nullable: false, length: 50, default: '0' })
  tax_free: string;

  @Column({  name: 'purchase_corp', nullable: false, length: 50 })
  purchase_corp: string;

  @Column({  name: 'purchase_corp_code', nullable: false, length: 50 })
  purchase_corp_code: string;

  @Column({  name: 'issuer_corp', nullable: false, length: 50 })
  issuer_corp: string;

  @Column({  name: 'issuer_corp_code', nullable: false, length: 50 })
  issuer_corp_code: string;

  @Column({  name: 'card_type', nullable: false, length: 50 })
  card_type: string;

  @Column({  name: 'install_month', nullable: false, length: 50 })
  install_month: string;

  @Column({  name: 'approved_id', nullable: false, length: 50 })
  approved_id: string;

  @Column({  name: 'interest_free_install', nullable: false, length: 50 })
  interest_free_install: string;

  @Column({  name: 'vat', nullable: false, length: 50 })
  vat: string;

  @Column({  name: 'canceled_at', nullable: false, length: 50 })
  canceled_at: string;

  @Column({  name: 'patno', nullable: false, length: 100, default: 'NULL' })
  patno: string;
}

