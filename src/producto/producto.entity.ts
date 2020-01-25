import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ClienteEntity} from "../cliente/cliente.entity";

@Entity('productos_bano')
export class ProductoEntity {

    @PrimaryGeneratedColumn({
        type:'int',
        unsigned:true,
        name:'id_producto',
        comment:'identificador del producto'
    })
    id:number;

    @Index({
        unique:false
    })
    @Column({
        type:'varchar',
        nullable:false,
        name:'nombre_producto',
        comment:'Nombre del producto'
    })
    nombre:string;

    @Column({
        type:'varchar',
        nullable:false,
        name:'descripcion_producto',
        comment:'Descripcion del producto de bano'
    })
    descripcion:string;

    @Column({
        type:'decimal',
        nullable:false,
        name:'costo_producto',
        comment:'Costo del producto de bano'
    })
    costo:number;

    @ManyToOne(
        type => ClienteEntity,
        cliente=>cliente.producto
    )
    cliente:ClienteEntity
}
