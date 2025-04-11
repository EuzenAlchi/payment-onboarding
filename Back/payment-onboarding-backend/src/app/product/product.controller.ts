import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from 'src/infrastructure/persistence/typeorm/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAll(): Promise<ProductEntity[]> {
    return this.productService.findAll();
  }

  @Post()
  create(@Body() body: CreateProductDto) {
    return this.productService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<ProductEntity>,
  ) {
    return this.productService.update(id, body);
  }
}