import { Module } from '@nestjs/common';
import { ClienteEntity } from './cliente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';

@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          ClienteEntity, // Entidades a usarse dentro
                        // del modulo.
        ],
        'default', // Nombre de la cadena de conex.
      ),
  ],
  controllers: [
    ClienteController,
  ],
  providers: [
    ClienteService,
  ],
  exports: [
    ClienteService,
  ],
})
export class ClienteModule {

}
