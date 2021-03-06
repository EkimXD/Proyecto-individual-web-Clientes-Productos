import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsPhoneNumber, Length, MaxLength, MinLength } from 'class-validator';

export class ProveedorCreateDto{

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
  @IsEmail()
  correo:string;

}
