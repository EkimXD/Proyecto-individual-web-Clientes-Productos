import { Controller, Get } from '@nestjs/common';
import { CabCarritoService } from './cab-carrito.service';

@Controller("cab-carrito")
export class CabCarritoController {
  constructor(
    private readonly _cabCarritoService:CabCarritoService,
  ) {}

  @Get("sayhey")
  sayhey(){
    return "cab-carrito"
  }
}
