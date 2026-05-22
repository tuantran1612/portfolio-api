import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsService } from './modules/projects/projects.service';
import { ProjectsController } from './modules/projects/projects.controller';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 10, // 10 req/min default
      },
    ]),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    CategoriesModule,
    ContactsModule,
    UsersModule,
  ],
  controllers: [AppController, ProjectsController],
  providers: [
    AppService,
    ProjectsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
