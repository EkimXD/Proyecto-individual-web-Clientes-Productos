import {Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';

@Entity('cliente')
export class ClienteEntity {

    @PrimaryGeneratedColumn({
        type:'int',
        unsigned:true,
        name:'id_cliente',
        comment:'identificador de la tabla cliente'
    })
    id:number;

    @Index({
        unique:true
    })
    @Column({
        type:'varchar',
        nullable:false,
        name:'numero_cedula_cliente',
        comment:'Numero de cedula del cliente'
    })
    numeroCedula:string;

    @Index({
        unique:false
    })
    @Column({
        type:'varchar',
        nullable:false,
        name:'nombre_cliente',
        comment:'Nombre del cliente'
    })
    nombre:string;

    @Index({
        unique:false
    })
    @Column({
        type:'varchar',
        nullable:false,
        name:'apellido_cliente',
        comment:'Apellido del cliente'
    })
    apellido:string;

    @Column({
        type:'varchar',
        nullable:true,
        name:'correo_cliente',
        comment:'Correo electronico del cliente'
    })
    correo:string;

    @Column({
        type:'varchar',
        nullable:true,
        name:'telefono_cliente',
        comment:'Correo electronico del cliente'
    })
    telefono:string;

    @Column({
        type:'varchar',
        nullable:true,
        name:'observacion_cliente',
        comment:'Observacion acerca del cliente'
    })
    observacion:string;

    @OneToMany(
        type=>ProductoEntity,
        producto=>producto.cliente
    )
    producto:ProductoEntity[]
}
