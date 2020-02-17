import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetCarritoEntity } from './det-carrito.entity';
import { DetCarritoController } from './det-carrito.controller';
import { DetCarritoService } from './det-carrito.service';


@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          DetCarritoEntity, // Entidades a usarse dentro
          // del modulo.
        ],
        'default', // Nombre de la cadena de conex.
      ),
  ],
  controllers: [
    DetCarritoController,
  ],
  providers: [
    DetCarritoService,
  ],
  exports: [
    DetCarritoService,
  ],
})
export class DetCarritoModule {

}
