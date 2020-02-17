import { Controller } from '@nestjs/common';
import { DetCarritoService } from './det-carrito.service';

@Controller("det-carrito")
export class DetCarritoController {

  constructor(
    private readonly _detCarrito:DetCarritoService
  ) {
  }
}
