import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';

@Injectable()
export class HttpConfService implements HttpModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: this.configService.get('HTTP_TIMEOUT'),
      maxRedirects: this.configService.get('HTTP_MAX_REDIRECTS'),
    };
  }
}
