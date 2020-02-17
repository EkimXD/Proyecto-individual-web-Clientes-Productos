import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProveedorModule } from './proveedor/proveedor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoModule } from './producto/producto.module';
import { ProveedorEntity } from './proveedor/proveedor.entity';
import { ProductoEntity } from './producto/producto.entity';
import { UsuarioModule } from './usuario/usuario.module';
import { UsuarioEntity } from './usuario/usuario.entity';
import { RolModule } from './rol/rol.module';
import { RolEntity } from './rol/rol.entity';
import { CabCarritoEntity } from './cab_carrito/cab-carrito.entity';
import { CabCarritoModule } from './cab_carrito/cab-carrito.module';
import { DetCarritoModule } from './det_carrito/det-carrito.module';
import { DetCarritoEntity } from './det_carrito/det-carrito.entity';

@Module({
  imports: [
    ProveedorModule,
    ProductoModule,
    UsuarioModule,
    RolModule,
    CabCarritoModule,
    DetCarritoModule,
    TypeOrmModule.forRoot(
      {
        name: 'default', // Nombre cadena de Conex.
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'clienteProductoBano',
        dropSchema: true,
        entities: [
          ProductoEntity,
          ProveedorEntity,
          UsuarioEntity,
          RolEntity,
          CabCarritoEntity,
          DetCarritoEntity,
        ],
        synchronize: true, // Crear -> true , Conectar -> false
      },
    )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
