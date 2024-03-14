import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (
        JwtService: JwtService,
      ): Promise<ApolloDriverConfig> => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: false,
        context: ({ req }) => {
          const token = req.headers.authorization?.replace('Bearer ', '');
          if (!token) {
            throw new Error('No token provided');
          }

          const payload = JwtService.decode(token);
          if (!payload) {
            throw new Error('Invalid token');
          }
        },
        plugins: [
          process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageProductionDefault({
                graphRef: 'my-graph-id@my-graph-variant',
                footer: false,
              })
            : (ApolloServerPluginLandingPageLocalDefault({
                footer: false,
              }) as unknown),
        ],
      }),
    }),
    UsersModule,
    AuthModule,
    CommonModule,
  ],
})
export class AppModule {}
