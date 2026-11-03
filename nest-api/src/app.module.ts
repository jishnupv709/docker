import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ??
        'mongodb://admin:admin123@localhost:27017/nestapp?authSource=admin',
    ),
    ItemsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/items*'],
      // Force it to serve index.html for the root route
      renderPath: '*', 
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}