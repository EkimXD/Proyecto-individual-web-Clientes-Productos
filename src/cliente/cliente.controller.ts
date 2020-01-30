import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Session } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteEntity } from './cliente.entity';
import { ClienteCreateDto } from './cliente.create-dto';
import { validate } from 'class-validator';
import { DeleteResult } from 'typeorm';
import { ClienteLogingDto } from './cliente.loging-dto';
import { strict } from 'assert';

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

  @Post('login')
  async iniciarSesion(
    @Body('correo') correo: string,
    @Body('contrasena') contrasena: string,
    @Session()session,
  ):Promise<ClienteEntity[]> {
    let clienteLogingDto = new ClienteLogingDto();
    clienteLogingDto.correo = correo;
    clienteLogingDto.contrasena = contrasena;
    const validacion=await validate(clienteLogingDto);
    console.log(validacion);
    if (validacion.length === 0) {
      const consultaWhere = [{correo:correo}];
      return this._clienteService.buscar(consultaWhere);
    }
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

