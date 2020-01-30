import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ClienteLogingDto{

  @IsNotEmpty()
  @IsEmail()
  correo:string;

  @IsNotEmpty()
  @MinLength(8)
  contrasena:string;
}
