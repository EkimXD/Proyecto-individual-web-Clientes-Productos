import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteEntity } from '../cliente/cliente.entity';
import { ClienteController } from '../cliente/cliente.controller';
import { ClienteService } from '../cliente/cliente.service';
import { ProductoEntity } from './producto.entity';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';

@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          ProductoEntity, // Entidades a usarse dentro
          // del modulo.
        ],
        'default', // Nombre de la cadena de conex.
      ),
  ],
  controllers: [
    ProductoController,
  ],
  providers: [
    ProductoService,
  ],
  exports: [
    ProductoService,
  ],
})

export class ProductoModule {

}
