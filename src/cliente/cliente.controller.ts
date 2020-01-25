import { Controller, Get } from '@nestjs/common';
import { ClienteService } from './cliente.service';

@Controller('cliente')
export class ClienteController {
  // tslint:disable-next-line:variable-name
  constructor(
    private readonly _clienteService: ClienteService,
  ) {}

  @Get('sayhey')
  getHello(){
    return 'cliente'
  }
}
