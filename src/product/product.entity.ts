import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'productos'})
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", width: 25, unique:true, nullable: false})
    nombre: string;

    @Column({type: 'varchar', width:255, nullable: true})
    descripcion: string;

    @Column({type: 'float', nullable: false})
    precio: number;
}