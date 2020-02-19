import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Session } from '@nestjs/common';
import { ProductoEntity } from './producto.entity';
import { validate } from 'class-validator';
import { ProductoService } from './producto.service';
import { ProductoCreateDto } from './producto.create-dto';
import { ProveedorEntity } from '../proveedor/proveedor.entity';
import { ProveedorService } from '../proveedor/proveedor.service';
import { DeleteResult, Like } from 'typeorm';
import { getValueOrDefault } from '@nestjs/cli/lib/compiler/helpers/get-value-or-default';

@Controller('producto')
export class ProductoController {

  constructor(
    private readonly _productoService: ProductoService,
    private readonly _proveedorService: ProveedorService,
  ) {
  }

  @Get('sayhey')
  hola() {
    return 'producto';
  }

  @Post(':id')
  async crearProducto(
    @Body() producto: ProductoEntity,
    @Param('id') id: string,
    @Session()session,
  ): Promise<ProductoEntity> {
    if (session.usuario !== undefined) {
      let ban = false;
      session.usuario.roles.forEach(value => {
        if (value == 'AD') {
          ban = true;
        }
      });
      if (ban) {
        const validacion = await validate(producto);
        if (validacion.length === 0) {
          producto.proveedor = await this.proveedor(+id);
          return this._productoService.crearUno(producto);
        } else {
          throw new BadRequestException('error en validacion');
        }
      } else {
        throw new BadRequestException('No posee permisos para realizar esta accion');
      }
    } else {
      throw new BadRequestException('No existe una sesion activa');
    }
  }

  @Post('/editar/:id')
  async editarProducto(
    @Param('id') id: string,
    @Body() producto: ProductoEntity,
    @Session()session,
  ): Promise<ProductoEntity> {
    if (session.usuario !== undefined) {
      let ban = false;
      session.usuario.roles.forEach(value => {
        if (value == 'AD') {
          ban = true;
        }
      });
      if (ban) {
        const validacion = await validate(producto);
        if (validacion.length === 0) {
          return this._productoService.actualizarUno(+id,producto);
        } else {
          throw new BadRequestException('error en validacion');
        }
      } else {
        throw new BadRequestException('No posee permisos para realizar esta accion');
      }
    } else {
      throw new BadRequestException('No existe una sesion activa');
    }
  }

  @Delete(':id')
  async borrarProducto(
    @Param('id') id: string,
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
        return this._productoService.borrarUno(+id);
      } else {
        throw new BadRequestException('No posee permisos para realizar esta accion');
      }
    } else {
      throw new BadRequestException('No existe una sesion activa');
    }
  }

  @Get()
  listarProductos(
    @Query("producto") producto:string,
  ): Promise<ProductoEntity[]> {
    let where={};
    if (producto!==undefined){
      where={nombre:Like (`%${producto}%`)}
    }
    return this._productoService.buscar(where);
  }

  @Get(":id")
  buscarProducto(
    @Param("id") id:string,
  ): Promise<ProductoEntity> {
    return this._productoService.encontrarUno(+id);
  }

  productoDTO(producto: ProductoEntity): ProductoCreateDto {
    let productoDTO = new ProductoCreateDto();
    productoDTO.nombre = producto.nombre;
    productoDTO.descripcion = producto.descripcion;
    productoDTO.costo = producto.costo;
    return productoDTO;
  }

  private proveedor(id: number): Promise<ProveedorEntity> {
    return this._proveedorService.encontrarUno(id);
  }
}
