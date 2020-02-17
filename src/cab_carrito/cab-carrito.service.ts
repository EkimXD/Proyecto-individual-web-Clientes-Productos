import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';
import { CabCarritoEntity } from './cab-carrito.entity';

@Injectable()
export class CabCarritoService {

  constructor(
    @InjectRepository(CabCarritoEntity)
    private _repositorioCabCarrito: Repository<CabCarritoEntity>
  ) {}
}
