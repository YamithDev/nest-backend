import { hash } from "bcryptjs";
import { RolEntity } from "src/rol/rol.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'usuario'})
export class UsuarioEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column({type: 'varchar', length: 10, nullable: true})
    nombre: string;

    
    @Column({type: 'varchar', length: 10, nullable: false, unique: true})
    nombreUsuario: string;

    @Column({type: 'varchar', length: 10, nullable: false, unique: true})
    email: string;

    @Column({type: 'varchar', nullable: false})
    password: string;

    @ManyToMany(type=> RolEntity, rol=> rol.usuarios, {eager: true})
    roles: RolEntity[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if(!this.password) return;
        this.password = await hash(this.password, 10);
    }
}