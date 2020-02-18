import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Session } from '@nestjs/common';
import { CabCarritoService } from './cab-carrito.service';
import { CabCarritoEntity } from './cab-carrito.entity';
import { CabCarritoCreateDto } from './cab-carrito.create-dto';
import { validate } from 'class-validator';
import { DeleteResult } from 'typeorm';
import { errorComparator } from 'tslint/lib/verify/lintError';

@Controller('cab-carrito')
export class CabCarritoController {
  constructor(
    private readonly _cabCarritoService: CabCarritoService,
  ) {
  }

  @Get('sayhey')
  sayhey() {
    return 'cab-carrito';
  }

  @Post()
  async crearCab(
    @Body("direccion") direccion: string,
    @Session() session,
  ):Promise<CabCarritoEntity> {
    if (session.usuario !== undefined) {
      let cabecera=this.generarCabecera();
      cabecera.direccion=direccion;
      const validacion = await validate(this.carritoDTO(cabecera));
      if (validacion.length === 0) {
        cabecera.usuario=session.usuario.id_usuario;
        return this._cabCarritoService.crearUno(cabecera);
      } else {
        throw new BadRequestException('Error en validacion');
      }
    }else{
      throw new BadRequestException('No existe sesion activa');
    }
  }

  @Delete(':id')
  async eliminarCabecera(
    @Param('id')id: string,
    @Session()session,
  ): Promise<DeleteResult | void> {
    if (session.usuario !== undefined) {
      return this.esPropietario(id, session)
        .then(
          bandera => {
            if (bandera) {
              return this._cabCarritoService.borrarUno(+id);
            } else {
              throw  new BadRequestException('No posee permisos para realizar esta accion');
            }
          },
        )
        .catch(
          reason => {
            console.log(reason.toString());
          },
        );
    } else {
      throw  new BadRequestException('No Existe usuario logeado');
    }
  }

  @Post(':id')
  async editarCabecera(
    @Param('id') id: string,
    @Body() cabecera: CabCarritoEntity,
    @Session() session,
  ): Promise<CabCarritoEntity | void> {
    //todo pendiente por editar!!!
    if (session.usuario !== undefined) {
      return this.esPropietario(id, session)
        .then(
          async bandera => {
            if (bandera) {
              const validacion = await validate(this.carritoDTO(cabecera));
              if (validacion.length === 0) {
                return this._cabCarritoService.actualizarUno(+id, cabecera);
              } else {
                throw  new BadRequestException('Error en validacion');
              }
            } else {
              throw  new BadRequestException('No posee permisos para realizar esta accion');
            }
          },
        )
        .catch(
          reason => {
            console.log(reason.toString());
          },
        );
    } else {
      throw  new BadRequestException('No Existe usuario logeado');
    }
  }

  @Get()
  buscarCabeceras(
    @Session()session,
  ): Promise<CabCarritoEntity[]> {
    if (session.usuario !== undefined) {
      const id: number = session.usuario.id_usuario;
      return this._cabCarritoService.buscar({ usuario: id }, 0, 10, { fecha: 'DESC' });
    } else {
      throw new BadRequestException('No existe una sesion activa');
    }
  }

  @Get('bAdmin')
  buscarCabecerasAdmin(
    @Session()session,
  ): Promise<CabCarritoEntity[]> {
    if (session.usuario !== undefined) {
      let ban = false;
      session.usuario.roles.forEach(value => {
        if (value === 'AD') {
          ban = true;
        }
      });
      if (ban) {
        const id: number = session.usuario.id_usuario;
        return this._cabCarritoService.buscar({ usuario: id }, 0, 10, { fecha: 'DESC' });
      } else {
        throw new BadRequestException('No posee permisos para realizar esta accion');
      }
    } else {
      throw new BadRequestException('No existe una sesion activa');
    }
  }

  private esPropietario(id, session): Promise<boolean> {
    return this._cabCarritoService.buscar({ id:id, usuario: session.usuario.id_usuario })
      .then(
        result => {
          let bandera = false;
          if (result.length !== 0) {
            bandera = true;
          } else {
            session.usuario.roles.forEach(value => {
              if (value === 'AD') {
                bandera = true;
              }
            });
          }
          return bandera;
        },
      );
  }

  private carritoDTO(carrito: CabCarritoEntity): CabCarritoCreateDto {
    let carritoDTO = new CabCarritoCreateDto();
    carritoDTO.estado = carrito.estado;
    carritoDTO.direccion = carrito.direccion;
    carritoDTO.fecha = carrito.fecha;
    carritoDTO.total = carrito.total;
    return carritoDTO;
  }

  private generarCabecera():CabCarritoEntity{
    const f=new Date();
    let cabecera=new CabCarritoEntity();
    cabecera.fecha=`${f.getFullYear()}/${f.getMonth()+1}/${f.getDate()}`;
    cabecera.total=0;
    cabecera.estado="Creado";
    return cabecera;
  }
}
