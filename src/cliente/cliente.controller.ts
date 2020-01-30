import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Req, Session } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteEntity } from './cliente.entity';
import { ClienteCreateDto } from './cliente.create-dto';
import { validate } from 'class-validator';
import { DeleteResult } from 'typeorm';
import { ClienteLogingDto } from './cliente.loging-dto';

@Controller('cliente')
export class ClienteController {
  // tslint:disable-next-line:variable-name
  constructor(
    private readonly _clienteService: ClienteService,
  ) {
  }

  @Get('sayhey')
  getHello() {
    return 'cliente';
  }

  @Post('login2')
  login(
    @Body('correo') username: string,
    @Body('contrasena') password: string,
    @Session() session,
  ) {
    console.log('Session', session);

      session.usuario = {
        nombre: 'Adrian',
        userId: 1,
        roles: ['Administrador'],
      }
      return 'ok';
  }

  @Post('login')
  async iniciarSesion(
    @Body('correo') correo: string,
    @Body('contrasena') contrasena: string,
    @Session()session,
  ) {
    let clienteLogingDto = new ClienteLogingDto();
    clienteLogingDto.correo = correo;
    clienteLogingDto.contrasena = contrasena;
    const validacion=await validate(clienteLogingDto);
    if (validacion.length === 0) {
      const consultaWhere = [{correo:correo}];
      await this._clienteService.buscar(consultaWhere)
        .then(
          resultado=>{
            const result:ClienteEntity=resultado[0];
            session.cliente={
              idcliente:result.id,
              nombre:result.nombre,
              apellido:result.apellido,
              rol:result.correo==='admin@admin.com'?'admin':'general',
            };
          }
        )
        .catch(
          error=>{
            console.log(error);
          }
        );

    }
  }

  @Get('get-session')
  getSession(
    @Session() session
  ){
    return session;
  }

  @Get('logout')
  logout(
    @Session() session,
    @Req() req,
  ) {
    session.cliente = undefined;
    req.session.destroy();
    return 'Deslogueado';
  }


  @Post()
  async crearUsuario(
    @Body() cliente: ClienteEntity,
  ): Promise<ClienteEntity> {
    let clienteDTO = new ClienteCreateDto();
    clienteDTO.nombre = cliente.nombre;
    clienteDTO.apellido = cliente.apellido;
    clienteDTO.cedula = cliente.numeroCedula;
    clienteDTO.contrasena = cliente.contrasena;
    clienteDTO.correo = cliente.correo;
    const validacion=await validate(clienteDTO);
    console.log(validacion);
    if (validacion.length === 0) {
      try {
        return this._clienteService.crearUno(cliente);
      }catch (e) {
        console.log(e);
      }
    } else {
      throw new BadRequestException('Error en validacion');
    }
  }

  @Delete(':id')
  eliminarCliente(
    @Param('id') idcliente: string,
  ): Promise<DeleteResult> {
    try {
      return this._clienteService.borrarUno(+idcliente);
    } catch (e) {
      console.log(e);
    }
  }

}

