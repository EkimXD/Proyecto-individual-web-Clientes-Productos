import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DetCarritoEntity } from './det-carrito.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DetCarritoService {
  constructor(
    @InjectRepository(DetCarritoEntity)
    private _detCarritoEntity:Repository<DetCarritoEntity>
  ) {
  }

  //todo aun por implementar
}
