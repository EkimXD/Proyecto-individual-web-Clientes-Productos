import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ProveedorLogingDto{

  @IsNotEmpty()
  @IsEmail()
  correo:string;

  @IsNotEmpty()
  @MinLength(8)
  contrasena:string;
}
