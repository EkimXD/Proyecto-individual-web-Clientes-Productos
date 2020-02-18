import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedorEntity } from '../proveedor/proveedor.entity';
import { ProveedorController } from '../proveedor/proveedor.controller';
import { ProveedorService } from '../proveedor/proveedor.service';
import { ProductoEntity } from './producto.entity';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';

@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          ProductoEntity, // Entidades a usarse dentro
          ProveedorEntity, // Entidades a usarse dentro
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
    ProveedorService,
  ],
  exports: [
    ProductoService,
  ],
})

export class ProductoModule {

}
