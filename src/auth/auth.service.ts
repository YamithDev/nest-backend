import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { MessageDto } from 'src/common/message.dto';
import { RolEntity } from 'src/rol/rol.entity';
import { RolNombre } from 'src/rol/rol.enum';
import { RolRepository } from 'src/rol/rol.repository';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { AuthRepository } from './auth.repository';
import { LoginUsuarioDto } from './dto/login.dto';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';
import { TokenDto } from './dto/token.dto';
import { PayloadInterface } from './payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RolEntity)
    private readonly rolRepository: RolRepository,
    @InjectRepository(UsuarioEntity)
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getAll(): Promise<UsuarioEntity[]> {
    const usuarios = await this.authRepository.find();
    if (!usuarios.length)
      throw new NotFoundException(
        new MessageDto('no hay usuarios en la lista'),
      );
    return usuarios;
  }

  async create(dto: NuevoUsuarioDto): Promise<any> {
    const { nombreUsuario, email } = dto;
    const exists = await this.authRepository.findOne({
      where: [{ nombreUsuario: nombreUsuario }, { email: email }],
    });
    if (exists)
      throw new BadRequestException(new MessageDto('El usuario ya existe'));
    const rolUser = await this.rolRepository.findOne({
      where: { rolNombre: RolNombre.USER },
    });
    if (!rolUser)
      throw new InternalServerErrorException(
        new MessageDto('Los roles no han sido creados'),
      );
    const usuario = this.authRepository.create(dto);
    usuario.roles = [rolUser];
    await this.authRepository.save(usuario);
    return new MessageDto('Usuario creado');
  }

  async login(dto: LoginUsuarioDto): Promise<any> {
    const { nombreUsuario } = dto;
    const usuario = await this.authRepository.findOne({
      where: [{ nombreUsuario: nombreUsuario }, { email: nombreUsuario }],
    });
    if (!usuario)
      return new UnauthorizedException(
        new MessageDto('Credenciales invalidas!'),
      );
    const isPassword = await compare(dto.password, usuario.password);
    if (!isPassword)
      return new UnauthorizedException(
        new MessageDto('Credenciales invalidas!'),
      );
    const payload: PayloadInterface = {
      id: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      roles: usuario.roles.map((rol) => rol.rolNombre as RolNombre),
    };
    const token = await this.jwtService.sign(payload);

    return { token };
  }

  async refresh(dto: TokenDto): Promise<any> {
    const usuario = await this.jwtService.decode(dto.token);
    const payload: PayloadInterface = {
      id: usuario['id'],
      nombreUsuario: usuario['nombreUsuario'],
      email: usuario['email'],
      roles: usuario['roles'],
    };
    const token = await this.jwtService.sign(payload);
    return { token };
  }
}
