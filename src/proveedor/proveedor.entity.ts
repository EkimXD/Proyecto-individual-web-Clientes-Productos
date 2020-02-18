import {Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';

@Entity('proveedor')
export class ProveedorEntity {

    @PrimaryGeneratedColumn({
        type:'int',
        unsigned:true,
        name:'id_proveedor',
        comment:'identificador de la tabla proveedor'
    })
    id:number;

    @Index({
        unique:true
    })
    @Column({
        type:'varchar',
        nullable:false,
        name:'numero_ruc_cliente',
        comment:'Numero de ruc del proveedor'
    })
    numeroRuc:string;

    @Index({
        unique:false
    })
    @Column({
        type:'varchar',
        nullable:false,
        name:'nombre_proveedor',
        comment:'Nombre del proveedor'
    })
    nombre:string;

    @Column({
        type:'varchar',
        nullable:false,
        name:'correo',
        comment:'Correo electronico del proveedor',
        unique:true
    })
    correo:string;

    @Column({
        type:'varchar',
        nullable:true,
        name:'telefono_proveedor',
        comment:'Correo electronico del proveedor'
    })
    telefono:string;

    @Column({
        type:'varchar',
        nullable:true,
        name:'observacion_proveedor',
        comment:'Observacion acerca del proveedor'
    })
    observacion:string;

    @OneToMany(
        type=>ProductoEntity,
        producto=>producto.cliente
    )
    producto:ProductoEntity[]

}
