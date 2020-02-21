import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Res, Session } from '@nestjs/common';
import {ProductoEntity} from './producto.entity';
import {validate} from 'class-validator';
import {ProductoService} from './producto.service';
import {ProductoCreateDto} from './producto.create-dto';
import {DeleteResult, Like} from 'typeorm';
import {UsuarioEntity} from "../usuario/usuario.entity";
import { ProveedorService } from '../proveedor/proveedor.service';
import { ProveedorEntity } from '../proveedor/proveedor.entity';

@Controller('producto')
export class ProductoController {

    constructor(
        private readonly _productoService: ProductoService,
        private readonly _proveedorService: ProveedorService,
    ) {
    }

    @Get('rutas/crear-producto')
    async rutaCrearUsuarios(
      @Query('error') error: string,
      @Query('proveedor') proveedor: string,
      @Res() res,
    ) {
        res.render(
          'productos/rutas/crear-producto',
          {
              datos: {
                  error,
                  proveedor
              },
          }
        );
    }


    @Get('sayhey')
    hola() {
        return 'producto';
    }

    @Post()
    async crearProducto(
        @Body() producto: ProductoEntity,
        @Query('proveedor') proveedor: string,
        @Query("idcategoria") idcategoria:string,
        @Session()session,
        @Res()res,
    ){
        console.log("llego");
        if (session.usuario !== undefined) {
            console.log("llego");
            const validacion = await validate(this.productoDTO(producto));
            console.log(validacion);
            if (validacion.length === 0&&producto.costo>=0) {
                console.log("entro52");
                producto.proveedor = await this.usuario(+proveedor);
                console.log("entro");
                this._productoService.crearUno(producto);
                res.redirect("/producto");
            } else {
                res.redirect("/producto/rutas/crear-producto?error=error en validacion&&proveedor="+proveedor);
            }
        } else {
            console.log("mal");
            res.render(
                'categoria/ruta/crear-categoria',
                {
                    datos:{
                        titulo:'No existe una sesion activa',
                        editable:false,
                    }

                }
            );
        }
    }

    @Get(':id')
    async editar(
        @Param('id') id: string,
        @Query("error")error:string,
        @Session()session,
        @Res()res,
    ) {
        if (session.usuario !== undefined) {
            let ban = false;
            await this._productoService.buscar({id: id, usuario: session.usuario.id_usuario})
                .then(value => {
                    if (value.length > 0) {
                        ban = true;
                    }
                });
            session.usuario.roles.forEach(value => {
                if (value == 'AD') {
                    ban = true;
                }
            });
            if (ban) {
                const producto=await this._productoService.encontrarUno(+id);
                res.render(
                    'productos/rutas/crear-producto',
                    {
                        datos: {
                            producto,
                            error
                        },
                    }
                );
            } else {
                res.render(
                    'categoria/ruta/crear-categoria',
                    {
                        datos:{
                            titulo:'No posee permisos para realizar esta accion',
                            editable:false,
                        }

                    }
                );
            }
        } else {
            res.render(
                'categoria/ruta/crear-categoria',
                {
                    datos:{
                        titulo:'No existe una sesion activa',
                        editable:false,
                    }

                }
            );
        }
    }

    @Post(':id')
    async editarProducto(
        @Param('id') id: string,
        @Body() producto: ProductoEntity,
        @Session()session,
        @Res()res,
    ) {
        if (session.usuario !== undefined) {
            let ban = false;
            await this._productoService.buscar({id: id, usuario: session.usuario.id_usuario})
                .then(value => {
                    if (value.length > 0) {
                        ban = true;
                    }
                });
            session.usuario.roles.forEach(value => {
                if (value == 'AD') {
                    ban = true;
                }
            });
            if (ban) {
                const validacion = await validate(this.productoDTO(producto));
                if (validacion.length === 0) {
                    this._productoService.actualizarUno(+id, producto);
                    res.redirect("/producto");
                } else {
                    res.redirect(`/producto/${id}?error=error en validacion`)
                }
            } else {
                res.render(
                    'categoria/ruta/crear-categoria',
                    {
                        datos:{
                            titulo:'No posee permisos para realizar esta accion',
                            editable:false,
                        }

                    }
                );
            }
        } else {
            res.render(
                'categoria/ruta/crear-categoria',
                {
                    datos:{
                        titulo:'No existe una sesion activa',
                        editable:false,
                    }

                }
            );
        }
    }

    @Get('/eliminar/:id')
    async borrarProducto(
        @Param('id') id: string,
        @Session()session,
        @Res()res,
    ) {
        if (session.usuario !== undefined) {
            let ban = false;
            await this._productoService.buscar({id: id, usuario: session.usuario.id_usuario})
                .then(value => {
                    if (value.length > 0) {
                        ban = true;
                    }
                });
            session.usuario.roles.forEach(value => {
                if (value == 'AD') {
                    ban = true;
                }
            });
            if (ban) {
                this._productoService.borrarUno(+id);
                res.redirect("/producto")
            } else {
                res.render(
                    'categoria/ruta/crear-categoria',
                    {
                        datos:{
                            titulo:'No posee permisos para realizar esta accion',
                            editable:false,
                        }

                    }
                );
            }
        } else {
            console.log("mal");
            res.render(
                'categoria/ruta/crear-categoria',
                {
                    datos:{
                        titulo:'No existe una sesion activa',
                        editable:false,
                    }

                }
            );
        }
    }

    @Get()
    async listarProductos(
        @Query("producto") producto: string,
        @Res()res
    ) {
        let where = {};
        if (producto !== undefined) {
            where = {nombre: Like(`%${producto}%`)}
        }
        const productos=await this._productoService.buscar(where,['proveedor']);
        res.render('productos/rutas/buscar-mostrar-producto',{
            datos:{
                productos
            }
            }
            )

    }

    @Get(":id")
    buscarProducto(
        @Param("id") id: string,
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

    private usuario(id: number): Promise<ProveedorEntity> {
      return this._proveedorService.encontrarUno(id);
    }

}
