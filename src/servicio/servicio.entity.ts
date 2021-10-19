import { ProductEntity } from "src/product/product.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'servicios'})
export class ServicioEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", width: 25, unique:true, nullable: false})
    nombre: string;

    @Column({type: 'varchar', width:255, nullable: true})
    descripcion: string;

    @Column({type: 'float', nullable: false})
    precio: number;

    @ManyToMany(type=> ProductEntity, producto=>producto.servicios)
    @JoinTable({
        name: 'producto_servicio',
        joinColumn: { name : 'producto_id'},
        inverseJoinColumn: { name: 'servicio_id'}
    })
    productos: ProductEntity[];
}