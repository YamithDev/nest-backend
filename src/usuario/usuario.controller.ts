import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) {}

    @Get()
    getAll(){
        return this.usuarioService.getAll();
    }

    @UsePipes(new ValidationPipe({whitelist: true}))
    @Post()
    create(@Body() dto: CreateUsuarioDto) {
        return this.usuarioService.create(dto);
    }
}