import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class AlimtalkConfService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'alimtalk',
      type: 'oracle',
      username: this.configService.get<string>('ALIMTALK_DB_USER'),
      password: this.configService.get<string>('ALIMTALK_DB_PASSWORD'),
      port: +this.configService.get<number>('ALIMTALK_DB_PORT'),
      host: this.configService.get<string>('ALIMTALK_DB_HOST'),
      database: this.configService.get<string>('ALIMTALK_DB_SCHEMA'),
      entities: ['dist/**/**/*.alimtalk-entity{.ts,.js}'],
      serviceName: 'ewsms'
      // autoLoadEntities: true,
      // synchronize: true,
    };
  }
}
