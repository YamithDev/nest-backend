import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { RolEntity } from 'src/rol/rol.entity';
import { RolNombre } from 'src/rol/rol.enum';
import { RolRepository } from 'src/rol/rol.repository';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { AuthRepository } from './auth.repository';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(RolEntity)
        private readonly rolRepository: RolRepository,
        @InjectRepository(UsuarioEntity)
        private readonly authRepository: AuthRepository
    ){}

    async getAll(): Promise<UsuarioEntity[]> {
        const usuarios = await this.authRepository.find();
        if(!usuarios.length) throw new NotFoundException(new MessageDto('no hay usuarios en la lista'));
        return usuarios;
    }

    async create(dto: NuevoUsuarioDto): Promise<any> {
        const {nombreUsuario, email} = dto;
        const exists = await this.authRepository.findOne({where: [{nombreUsuario: nombreUsuario}, {email: email}]});
        if(exists) throw new BadRequestException(new MessageDto('El usuario ya existe'));
        const rolUser = await this.rolRepository.findOne({where:{rolNombre: RolNombre.USER}});
        if(!rolUser) throw new InternalServerErrorException(new MessageDto('Los roles no han sido creados'));
        const usuario = this.authRepository.create(dto);
        usuario.roles = [rolUser];
        await this.authRepository.save(usuario);
        return new MessageDto('Usuario creado');
    }
}
