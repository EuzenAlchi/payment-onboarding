import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  price: number;

  @IsInt()
  stock: number;

  @IsBoolean()
  available: boolean;
}
