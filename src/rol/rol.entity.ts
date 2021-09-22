import { UsuarioEntity } from "src/usuario/usuario.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolNombre } from "./rol.enum";

@Entity({name: 'rol'})
export class RolEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column({type: 'varchar', length: 10, nullable: false, unique:true})
    rolNombre: RolNombre;

    @ManyToMany(type=> UsuarioEntity, usuario=>usuario.roles)
    @JoinTable({
        name: 'usuario_rol',
        joinColumn: { name : 'usuario_id'},
        inverseJoinColumn: { name: 'rol_id'}
    })
    usuarios: UsuarioEntity[]
}