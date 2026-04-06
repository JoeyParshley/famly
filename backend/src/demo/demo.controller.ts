import { Controller, Get, Post, Body } from '@nestjs/common';
import { DemoService } from './demo.service';
import { DemoLoginDto } from './dto/demo-login.dto';
import { Public } from '../auth/public.decorator';

@Controller('api/auth')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get('demo-users')
  @Public()
  getDemoUsers() {
    return this.demoService.getDemoUsers();
  }

  @Post('demo-login')
  @Public()
  demoLogin(@Body() dto: DemoLoginDto) {
    return this.demoService.demoLogin(dto);
  }
}
