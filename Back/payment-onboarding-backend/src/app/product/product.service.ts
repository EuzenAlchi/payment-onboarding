// Ruta: src/app/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from 'src/infrastructure/persistence/typeorm/entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  findAll() {
    return this.productRepository.find();
  }

  create(data: Partial<ProductEntity>) {
    const product = this.productRepository.create(data);
    return this.productRepository.save(product);
  }

  update(id: number, data: Partial<ProductEntity>) {
    return this.productRepository.update(id, data);
  }
}