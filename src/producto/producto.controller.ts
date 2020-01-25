import { Controller, Get } from '@nestjs/common';

@Controller('producto')
export class ProductoController {

  @Get('sayhey')
  hola(){
    return 'producto'
  }
}
