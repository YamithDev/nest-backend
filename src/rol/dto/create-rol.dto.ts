import { IsEnum } from "class-validator";
import { RolNombre } from "../rol.enum";

export class CreateRolDto {
    
    @IsEnum(RolNombre, {message: 'El rol solo puede ser user o admin'})
    rolNombre: string;
}