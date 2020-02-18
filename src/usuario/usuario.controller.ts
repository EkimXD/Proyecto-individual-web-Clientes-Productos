import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Module,
  Param,
  Post, Query,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioCreateDto } from './usuario.create-dto';
import { validate } from 'class-validator';
import { RolService } from '../rol/rol.service';
import { DeleteResult } from 'typeorm';
import { UsuarioLoginDto } from './usuario.login-dto';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly _usuarioService: UsuarioService,
    private readonly _rolService: RolService,
  ) {
  }

  @Get('sayhey')
  async sayName() {
    return 'usuario';
  }

  @Get('get-session')
  getSession(
    @Session()session,
  ) {
    return session;
  }

  @Get('logout')
  sessionLogout(
    @Session()session,
    @Req()req,
  ) {
    session.usuario = undefined;
    req.session.destroy();
    return 'Deslogueado';
  }

  @Get('login')
  async login(
    @Body('usuario') usuario: string,
    @Body('contrasena') contrasena: string,
    @Session()session,
  ) {
    const validacion = await validate(this.usuarioDTOtoLG(usuario, contrasena));
    if (validacion.length === 0) {
      const where = [
        { nick: usuario },
        { correo: usuario },
      ];
      await this._usuarioService.buscar(where, ['rol'])
        .then(
          async resultado => {
            try {
              const result: UsuarioEntity = resultado[0];
              if (result.contrasena === contrasena) {
                let arregloRoles: Array<string> = new Array<string>();
                result.rol.forEach((rol) => {
                  arregloRoles.push(rol.nombre);
                });
                session.usuario = {
                  id_usuario: result.id_usuario,
                  usuario: result.nick,
                  roles: arregloRoles,
                  carritoAC:null
                };

              } else {
                console.log('Contrasena incorrecta');
              }
            } catch (e) {
              console.log(e);
              throw new BadRequestException('Imposible crear una nueva sesion, su usuario no existe o exiten duplicados');
            }
          },
        )
        .catch(
          error => {
            console.log(error);
          },
        );
    } else {
      throw new BadRequestException('Error en validacion');
    }
  }

  @Delete(':id')
  borrarUsusario(
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    try {
      return this._usuarioService.borrarUno(+id);
    } catch (e) {
      console.log(e);
    }
  }

  @Post()
  async crearUsuario(
    @Body() usuario: UsuarioEntity,
  ) {
    const validacion = await validate(this.usuarioDTOtoGE(usuario));
    if (validacion.length === 0) {
      const where = [{
        id: 1,
      }, {
        id: 2,
      }];
      console.log("aqui");
      await this._rolService.buscar(where)
        .then(
          resultado => {
            if (resultado.length >= 2) {
              usuario.rol = [resultado[0], resultado[1]];
              return this._usuarioService.crearUno(usuario);
            }
            else {
              throw new BadRequestException('No se puede crear usuario, no existen roles aplicables');
              //todo cambiar mensaje
            }
          },
        )
        // .then(
        //   resultado=>{
        //       //todo usuario creado
        //   }
        // )
        .catch(
          error => {
            console.log(error);
            //todo usuario no creado
          },
        );
    } else {
      throw new BadRequestException(`Error validando \n${validacion}`);
    }

  }

  @Post(':id')
  async editarUsuario(
    @Body()usuario: UsuarioEntity,
    @Param('id')id: string,
  ) {
    try {
      let validacion = await validate(this.usuarioDTOtoGE(usuario));
      if (validacion.length == 0) {
        this._usuarioService.actualizarUno(+id, usuario)
          .then(
            //todo hacer algo
          )
          .catch(
            //todo hacer algo x2
          );

        // this._usuarioService.buscar({id_usuario:+id},['rol'])
        //     .then(
        //         resultado=>{
        //             usuario.rol=resultado[0].rol;
        //         }
        //     )
        //     .catch(
        //         error=>{
        //             console.log(error)
        //         }
        //     )
      } else {
        console.log('error en validacion');
        //todo algo :v
      }

    } catch (e) {
      console.log(e);
    }

  }

  @Get()
  async buscar(
    @Query('skip') skip?: string | number,
    @Query('take') take?: string | number,
    @Query('where') where?: string,
    @Query('order') order?: any,
  ): Promise<UsuarioEntity[]> {
    if (order) {
      try {
        order = JSON.parse(order);
      } catch (e) {
        order = undefined;
      }
    }
    if (where) {
      try {
        where = JSON.parse(where);
      } catch (e) {
        where = undefined;
      }
    }
    if (skip) {
      skip = +skip;
    }
    if (take) {
      take = +take;
    }
    return this._usuarioService
      .buscar(
        where,
        skip as number,
        take as number,
        order,
      );
  }

  usuarioDTOtoGE(usuario: UsuarioEntity): UsuarioCreateDto {
    let usuarioDTO = new UsuarioCreateDto();

    usuarioDTO.nombre = usuario.nombre;
    usuarioDTO.apellido = usuario.apellido;
    usuarioDTO.correo = usuario.correo;
    usuarioDTO.contrasena = usuario.contrasena;
    usuarioDTO.fecha_nac = usuario.fecha_nac;
    usuarioDTO.nick = usuario.nick;
    usuarioDTO.telefono = usuario.telefono;

    return usuarioDTO;
  }

  usuarioDTOtoLG(usuario: string, contrasena: string): UsuarioLoginDto {
    let usuarioLoginDto = new UsuarioLoginDto();

    usuarioLoginDto.usuario = usuario;
    usuarioLoginDto.contrasena = contrasena;

    return usuarioLoginDto;
  }
}
