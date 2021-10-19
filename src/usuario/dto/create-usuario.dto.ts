import { IsEmail, IsString, MaxLength } from 'class-validator';
import { IsNotBlank } from 'src/decorators/is-not-blank.decorator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsNotBlank({ message: 'el usuario no puede estar vacio' })
  @MaxLength(10, { message: 'nombre de usuario: longitud máxima de 10' })
  nombreUsuario: string;

  @IsEmail()
  email: string;

  @IsNotBlank({ message: 'la contraseña del usuario no debe estar vacía' })
  password: string;
}
