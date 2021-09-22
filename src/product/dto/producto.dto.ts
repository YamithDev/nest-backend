import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { IsNotBlank } from 'src/decorators/is-not-blank.decorator';

export class ProductoDto {
  @IsNotEmpty()
  @IsNotBlank({ message: 'El nombre no debe estar vacío' })
  nombre?: string;

  @IsString()
  descripcion?: string;
}
