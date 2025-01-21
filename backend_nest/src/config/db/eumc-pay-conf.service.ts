import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class EumcPayConfService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'eumc_pay',
      type: 'mysql',
      username: this.configService.get<string>('EUMC_PAY_DB_USER'),
      password: this.configService.get<string>('EUMC_PAY_DB_PASSWORD'),
      port: this.configService.get<number>('EUMC_PAY_DB_PORT'),
      host: this.configService.get<string>('EUMC_PAY_DB_HOST'),
      database: this.configService.get<string>('EUMC_PAY_DB_SCHEMA'),
      entities: ['dist/**/**/*.eumc-entity{.ts,.js}'],
      // autoLoadEntities: true,
      // synchronize: true,
    };
  }
}
