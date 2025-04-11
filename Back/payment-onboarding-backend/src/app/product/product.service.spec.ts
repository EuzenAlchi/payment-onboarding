import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductEntity } from 'src/infrastructure/persistence/typeorm/entities/product.entity';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;

  const mockProductRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería retornar todos los productos', async () => {
    const result = [{ id: 1, name: 'Producto 1' }];
    mockProductRepository.find.mockResolvedValue(result);

    const products = await service.findAll();
    expect(products).toEqual(result);
    expect(mockProductRepository.find).toHaveBeenCalled();
  });

  it('debería crear un producto', async () => {
    const dto = { name: 'Nuevo producto' };
    const mockProduct = { id: 1, ...dto };

    mockProductRepository.create.mockReturnValue(mockProduct);
    mockProductRepository.save.mockResolvedValue(mockProduct);

    const created = await service.create(dto);
    expect(created).toEqual(mockProduct);
    expect(mockProductRepository.create).toHaveBeenCalledWith(dto);
    expect(mockProductRepository.save).toHaveBeenCalledWith(mockProduct);
  });

  it('debería actualizar un producto', async () => {
    const id = 1;
    const data = { name: 'Actualizado' };

    mockProductRepository.update.mockResolvedValue({ affected: 1 });

    const result = await service.update(id, data);
    expect(result).toEqual({ affected: 1 });
    expect(mockProductRepository.update).toHaveBeenCalledWith(id, data);
  });
});
