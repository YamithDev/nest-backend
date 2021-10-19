import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUsuarioDto } from './dto/login.dto';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAll() {
    return this.authService.getAll();
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('nuevo')
  create(@Body() dto: NuevoUsuarioDto) {
    return this.authService.create(dto);
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('login')
  login(@Body() dto: LoginUsuarioDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: TokenDto) {
    return this.authService.refresh(dto);
  }
}
