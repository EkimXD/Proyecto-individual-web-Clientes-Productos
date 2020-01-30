import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsPhoneNumber, Length, MaxLength, MinLength } from 'class-validator';

export class ClienteCreateDto{

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @IsNumberString()
  cedula:string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  nombre:string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  apellido:string;

  @IsNotEmpty()
  @IsEmail()
  correo:string;

  @IsNotEmpty()
  @MinLength(8)
  contrasena:string;


}
