import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
     constructor() {
          super({
               log: process.env.NODE_ENV === 'development'
                    ? ['query', 'error', 'warn']
                    : ['error'],
          })
     }

     async onModuleInit() {
          await this.$connect()
          console.log('Database connected successfully!!')
     }

     async onModuleDestroy() {
          await this.$disconnect()
          console.log('Database disconnected!!')
     }

     async cleanDatabase() {
          if (process.env.NODE_ENV === 'production') {
               throw new Error('Cannot clean database')
          }

          const models = Reflect.ownKeys(this).filter(
               (key) => typeof key === 'string' && !key.startsWith('_')
          )

          return Promise.all(
               models.map((modelKey) => {
                    if (typeof modelKey === 'string') {
                         return (this as any)[modelKey].deleteMany()
                    }
               })
          )
     }
}