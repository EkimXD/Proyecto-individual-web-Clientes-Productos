import { BadRequestException, Body, Controller, Get, Post, Query, Session } from '@nestjs/common';
import { DetCarritoService } from './det-carrito.service';
import { DetCarritoEntity } from './det-carrito.entity';
import { CabCarritoService } from '../cab_carrito/cab-carrito.service';
import { DetCarritoCreateDto } from './det-carrito.create-dto';
import { validate } from 'class-validator';
import { ProductoService } from '../producto/producto.service';

@Controller('det-carrito')
export class DetCarritoController {

  constructor(
    private readonly _detCarrito: DetCarritoService,
    private readonly _cabCarrito: CabCarritoService,
    private readonly _productoService: ProductoService,
  ) {
  }

  @Get('sayhey')
  sayhey() {
    return 'detalle';
  }

  @Post()
  async agregarDetalle(
    @Body() detalle: DetCarritoEntity,
    @Query('idproducto') idProducto: string,
    @Session() session,
  ):Promise<DetCarritoEntity|void> {
    if (session.usuario !== undefined) {
      return this._productoService.encontrarUno(+idProducto)
        .then(
          async result => {
            const id: number = session.usuario.id_usuario;
            detalle.producto = result;
            detalle.precio = result.costo;
            const validacion=await validate(this.detalleDTO(detalle));
            if(validacion.length===0){
              detalle.subtotal = detalle.cantidad * detalle.precio;
              return this._cabCarrito.buscar({ usuario: id, estado: 'Creado' });
            }else{
              throw new BadRequestException("error en validacion");
            }
          },
        )
        .then(
          result => {
            if (result.length > 0) {
              detalle.cab = result[0];
              return this._detCarrito.crearUno(detalle);
            }else {
              throw new BadRequestException("No existe cabecera, cree una e intente denuevo");
            }
          },
        )
        .catch(
          error => {
            throw new BadRequestException(error);
          },
        );
    } else {
      throw new BadRequestException('No se encontro una sesion activa');
    }
  }


  private detalleDTO(detalle: DetCarritoEntity): DetCarritoCreateDto {
    let detalleDTO = new DetCarritoCreateDto();
    detalleDTO.cantidad = detalle.cantidad;
    detalleDTO.precio = detalle.precio;
    return detalleDTO;
  }
}
