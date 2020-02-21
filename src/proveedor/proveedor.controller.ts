import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Req, Res, Session } from '@nestjs/common';
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

  @Get('/crear')
  async crear(
    @Query("error")error:string,
    @Session()session,
    @Res()res,
  ) {
    if (session.usuario !== undefined) {
      let ban = false;
      session.usuario.roles.forEach(value => {
        if (value == 'AD') {
          ban = true;
        }
      });
      if (ban) {
        res.render('proveedor/ruta/crear-proveedor', {
          datos: {
            titulo: 'Crear proveedor',
            editable: true,
            error,
          },
        });
      } else {
        res.render(
          'rol/ruta/crear-rol',
          {
            datos:{
              titulo:'No posee permisos para realizar esta accion',
              editable:false
            }
          }
        );
      }
    } else {
      res.render(
        'rol/ruta/crear-rol',
        {
          datos:{
            titulo:'No existe una sesion activa',
            editable:false
          }
        }
      );
    }
  }

  @Post()
  async crearProveedor(
    @Body() proveedor: ProveedorEntity,
    @Session()session,
    @Res()res,
  ) {
    if (session.usuario !== undefined) {
      let ban = false;
      session.usuario.roles.forEach(value => {
        if (value == 'AD') {
          ban = true;
        }
      });
      if (ban) {
        const validacion = await validate(this.proveedorDTO(proveedor));
        console.log(validacion);
        if (validacion.length === 0) {
          try {
            this._proveedorService.crearUno(proveedor);
            res.redirect('/proveedor');
          } catch (e) {
            console.log(e);
          }
        } else {
          res.redirect('/proveedor/crear?error=Error en validacion');
        }
      } else {
        res.render(
          'rol/ruta/crear-rol',
          {
            datos: {
              titulo: 'No posee permisos para realizar esta accion',
              editable: false
            }
          }
        );
      }
    } else {
      res.render(
        'rol/ruta/crear-rol',
        {
          datos:{
            titulo:'No existe una sesion activa',
            editable:false
          }
        }
      );

    }
  }

  @Post('/eliminar/:id')
  eliminarCliente(
    @Param('id') idcliente: string,
    @Session()session,
    @Res()res,
  ) {
    if (session.usuario !== undefined) {
      let ban = false;
      session.usuario.roles.forEach(value => {
        if (value == 'AD') {
          ban = true;
        }
      });
      if (ban) {
        this._proveedorService.borrarUno(+idcliente);
        res.redirect('/proveedor')
      } else {
        res.render(
          'rol/ruta/crear-rol',
          {
            datos:{
              titulo:'Tiene permisos para realizar esta accion',
              editable:false
            }
          }
        );
      }
    } else {
      res.render(
        'rol/ruta/crear-rol',
        {
          datos:{
            titulo:'No existe una sesion activa',
            editable:false
          }
        }
      );
    }
  }

  @Get()
  async listarProveedores(
    @Query('proveedor') proveedor: string,
    @Res()res,
  ) {
    let where = {};
    if (proveedor !== undefined) {
      where = { nombre: `%${proveedor}%` };
    }
    const proveedores = await this._proveedorService.buscar(where,['producto']);
    res.render('proveedor/ruta/buscar-mostrar-proveedor', {
      datos: {
        proveedor: proveedores,
      },
    });
  }

  @Get(':id')
  buscarProveedor(
    @Param('id') id: string,
  ): Promise<ProveedorEntity> {
    return this._proveedorService.encontrarUno(+id);
  }

  private proveedorDTO(cliente: ProveedorEntity): ProveedorCreateDto {
    let clienteDTO = new ProveedorCreateDto();
    clienteDTO.nombre = cliente.nombre;
    clienteDTO.cedula = cliente.numeroRuc;
    clienteDTO.correo = cliente.correo;
    return clienteDTO;
  }
}

