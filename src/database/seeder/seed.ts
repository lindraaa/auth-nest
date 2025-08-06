import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedService } from '../seeder/seed.service';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seeder = app.get(SeedService);

    await seeder.run();
    console.log('Seeding complete!');

    await app.close();
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

bootstrap();
