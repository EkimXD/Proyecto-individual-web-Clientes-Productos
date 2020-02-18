import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Req, Session } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ProveedorEntity } from './proveedor.entity';
import { ProveedorCreateDto } from './proveedor.create-dto';
import { validate } from 'class-validator';
import { DeleteResult } from 'typeorm';
import { ProveedorLogingDto } from './proveedor.loging-dto';
import { ProductoEntity } from '../producto/producto.entity';

@Controller('proveedor')
export class ProveedorController {
  // tslint:disable-next-line:variable-name
  constructor(
    private readonly _proveedorService: ProveedorService,
  ) {
  }

  @Get('sayhey')
  getHello() {
    return 'proveedor';
  }

  @Post()
  async crearProveedor(
    @Body() proveedor: ProveedorEntity,
    @Session()session,
  ): Promise<ProveedorEntity> {
    if (session.usuario !== undefined) {
      let ban = false;
      session.usuario.roles.forEach(value => {
        if (value == 'AD') {
          ban = true;
        }
      });
      if (ban) {
        const validacion=await validate(this.proveedorDTO(proveedor));
        console.log(validacion);
        if (validacion.length === 0) {
          try {
            return this._proveedorService.crearUno(proveedor);
          }catch (e) {
            console.log(e);
          }
        } else {
          throw new BadRequestException('Error en validacion');
        }
      } else {
        throw new BadRequestException('No existe una sesion activa');
      }
    } else {
      throw new BadRequestException('No existe una sesion activa');
    }
  }

  @Delete(':id')
  eliminarCliente(
    @Param('id') idcliente: string,
    @Session()session,
  ): Promise<DeleteResult> {
    if (session.usuario !== undefined) {
      let ban = false;
      session.usuario.roles.forEach(value => {
        if (value == 'AD') {
          ban = true;
        }
      });
      if (ban) {
        return this._proveedorService.borrarUno(+idcliente);
      } else {
        throw new BadRequestException('No existe una sesion activa');
      }
    } else {
      throw new BadRequestException('No existe una sesion activa');
    }
  }

  @Get(

  )@Get()
  listarProveedores(
    @Query("proveedor") proveedor:string,
  ): Promise<ProveedorEntity[]> {
    let where={};
    if (proveedor!==undefined){
      where={nombre:`%${proveedor}%`}
    }
    return this._proveedorService.buscar(where);
  }

  @Get(":id")
  buscarProveedor(
    @Param("id") id:string,
  ): Promise<ProveedorEntity> {
    return this._proveedorService.encontrarUno(+id);
  }

  private proveedorDTO(cliente:ProveedorEntity):ProveedorCreateDto{
    let clienteDTO = new ProveedorCreateDto();
    clienteDTO.nombre = cliente.nombre;
    clienteDTO.cedula = cliente.numeroRuc;
    clienteDTO.correo = cliente.correo;
    return clienteDTO;
  }
}

