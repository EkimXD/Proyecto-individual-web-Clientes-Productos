import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteModule } from './cliente/cliente.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoModule } from './producto/producto.module';
import { ClienteEntity } from './cliente/cliente.entity';
import { ProductoEntity } from './producto/producto.entity';

@Module({
  imports: [
    ClienteModule,
    ProductoModule,
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
          ClienteEntity,
        ],
        synchronize: true, // Crear -> true , Conectar -> false
      },
    )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
