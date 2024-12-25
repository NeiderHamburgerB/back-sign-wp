import { Module } from '@nestjs/common';
import { ApiModule } from './modules';
import { HealthcheckController } from './healthcheck.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    // TypeORM config will be here
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    ApiModule,
  ],
  controllers: [HealthcheckController],
  providers: [],
})
export class AppModule {}
