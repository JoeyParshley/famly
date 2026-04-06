import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferencesService } from './preferences.service';
import { PreferencesController } from './preferences.controller';
import { UserPreference } from './entities/user-preference.entity';
import { User } from '../auth/entities/user.entity';
import { PreferencesResolver } from './graphql/preferences.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreference, User])],
  controllers: [PreferencesController],
  providers: [PreferencesService, PreferencesResolver],
  exports: [PreferencesService],
})
export class PreferencesModule {}
