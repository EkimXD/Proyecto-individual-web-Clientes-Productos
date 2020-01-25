import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ClienteEntity} from "./cliente.entity";
import {DeleteResult, Like, MoreThan, Repository} from "typeorm";

@Injectable()
export class ClienteService {
    constructor(
        @InjectRepository(ClienteEntity) // Inyectar Dependencias
        private _repositorioCliente: Repository<ClienteEntity>
    ) {}

    encontrarUno(id: number): Promise<ClienteEntity | undefined> {
        return this._repositorioCliente
            .findOne(id);
    }

    crearUno(usuario: ClienteEntity) {
        return this._repositorioCliente
            .save(usuario);
    }

    borrarUno(id: number): Promise<DeleteResult> {
        return this._repositorioCliente
            .delete(id);
    }

    actualizarUno(
        id: number,
        usuario: ClienteEntity
    ): Promise<ClienteEntity> {
        usuario.id = id;
        return this._repositorioCliente
            .save(usuario); // UPSERT
    }

    buscar(
        where: any = {},
        skip: number = 0,
        take: number = 10,
        order: any = {
            id: 'DESC',
            nombre: 'ASC'
        }
    ): Promise<ClienteEntity[]> {

        // Exactamente el nombre o Exactamente la cedula
        const consultaWhere = [
            {
                nombre: ''
            },
            {
                cedula: ''
            }
        ];

        // Exactamente el nombre o LIKE la cedula
        const consultaWhereLike = [
            {
                nombre: Like('a%')
            },
            {
                cedula: Like('%a')
            }
        ];

        // id sea mayor a 20
        const consultaWhereMoreThan = {
            id: MoreThan(20)
        };

        // id sea igual a x
        const consultaWhereIgual = {
            id: 30
        };

        return this._repositorioCliente
            .find({
                where: where,
                skip: skip,
                take: take,
                order: order,
            });
    }
}
