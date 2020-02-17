import { Module } from '@nestjs/common';
import { ProveedorEntity } from './proveedor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedorController } from './proveedor.controller';
import { ProveedorService } from './proveedor.service';

@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          ProveedorEntity, // Entidades a usarse dentro
                        // del modulo.
        ],
        'default', // Nombre de la cadena de conex.
      ),
  ],
  controllers: [
    ProveedorController,
  ],
  providers: [
    ProveedorService,
  ],
  exports: [
    ProveedorService,
  ],
})
export class ProveedorModule {

}
