import {Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';

@Entity('proveedor')
export class ProveedorEntity {

    @PrimaryGeneratedColumn({
        type:'int',
        unsigned:true,
        name:'id_cliente',
        comment:'identificador de la tabla proveedor'
    })
    id:number;

    @Index({
        unique:true
    })
    @Column({
        type:'varchar',
        nullable:false,
        name:'numero_cedula_cliente',
        comment:'Numero de cedula del proveedor'
    })
    numeroCedula:string;

    @Index({
        unique:false
    })
    @Column({
        type:'varchar',
        nullable:false,
        name:'nombre_cliente',
        comment:'Nombre del proveedor'
    })
    nombre:string;

    @Index({
        unique:false
    })
    @Column({
        type:'varchar',
        nullable:false,
        name:'apellido_cliente',
        comment:'Apellido del proveedor'
    })
    apellido:string;

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
        name:'telefono_cliente',
        comment:'Correo electronico del proveedor'
    })
    telefono:string;

    @Column({
        type:'varchar',
        nullable:true,
        name:'observacion_cliente',
        comment:'Observacion acerca del proveedor'
    })
    observacion:string;

    @Column({
        type:'varchar',
        nullable:false,
        name:'contrasena_cliente',
        comment:'Contrasena del proveedor'
    })
    contrasena:string;

    @OneToMany(
        type=>ProductoEntity,
        producto=>producto.cliente
    )
    producto:ProductoEntity[]

}
