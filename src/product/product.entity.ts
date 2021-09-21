import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'productos'})
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", width: 25, unique:true, nullable: false})
    nombre: string;

    @Column({type: 'float', nullable: false})
    precio: number;
}