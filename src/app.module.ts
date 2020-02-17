import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteModule } from './cliente/cliente.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoModule } from './producto/producto.module';
import { ClienteEntity } from './cliente/cliente.entity';
import { ProductoEntity } from './producto/producto.entity';
import { UsuarioModule } from './usuario/usuario.module';
import { UsuarioEntity } from './usuario/usuario.entity';
import { RolModule } from './rol/rol.module';
import { RolEntity } from './rol/rol.entity';

@Module({
  imports: [
    ClienteModule,
    ProductoModule,
    UsuarioModule,
    RolModule,
    TypeOrmModule.forRoot(
      {
        name: 'default', // Nombre cadena de Conex.
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '1234',
        database: 'clienteProductoBano',
        dropSchema: false,
        entities: [
          ProductoEntity,
          ClienteEntity,
          UsuarioEntity,
          RolEntity,
        ],
        synchronize: true, // Crear -> true , Conectar -> false
      },
    )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
