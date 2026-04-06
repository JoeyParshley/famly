import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users/preferences')
@UseGuards(JwtAuthGuard)
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  getPreferences(@Request() req) {
    return this.preferencesService.getPreferences(req.user.id);
  }

  @Patch()
  updatePreferences(
    @Request() req,
    @Body() updateDto: UpdatePreferencesDto,
  ) {
    return this.preferencesService.updatePreferences(req.user.id, updateDto);
  }
}
