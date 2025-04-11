// Ruta: src/infrastructure/persistence/typeorm/entities/product.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('int')
  price: number;

  @Column('int')
  stock: number;

  @Column({ default: true })
  available: boolean;
}