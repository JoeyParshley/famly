import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { User } from '../auth/entities/user.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(UserPreference)
    private preferenceRepository: Repository<UserPreference>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getPreferences(userId: string): Promise<UserPreference> {
    let preferences = await this.preferenceRepository.findOne({
      where: { user: { id: userId } },
    });

    // Create default preferences if none exist
    if (!preferences) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      preferences = this.preferenceRepository.create({
        user,
        theme: 'light',
        balanceAlertThreshold: 500,
      });
      await this.preferenceRepository.save(preferences);
    }

    return preferences;
  }

  async updatePreferences(
    userId: string,
    updateDto: UpdatePreferencesDto,
  ): Promise<UserPreference> {
    let preferences = await this.preferenceRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!preferences) {
      // Create new preferences
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      preferences = this.preferenceRepository.create({
        user,
        ...updateDto,
      });
    } else {
      Object.assign(preferences, updateDto);
    }

    return this.preferenceRepository.save(preferences);
  }

  async getTheme(userId: string): Promise<string> {
    const preferences = await this.getPreferences(userId);
    return preferences.theme;
  }

  async getAlertThreshold(userId: string): Promise<number> {
    const preferences = await this.getPreferences(userId);
    return Number(preferences.balanceAlertThreshold);
  }
}
