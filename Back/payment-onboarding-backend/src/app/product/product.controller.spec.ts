import { Test, TestingModule } from '@nestjs/testing'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ProductEntity } from 'src/infrastructure/persistence/typeorm/entities/product.entity'

describe('ProductController', () => {
  let controller: ProductController
  let service: ProductService

  const mockProduct: ProductEntity = {
    id: 1,
    name: 'Camisa de algodón',
    description: 'Camisa blanca 100% algodón',
    price: 55000,
    stock: 10,
    available: true,
  }

  const mockService = {
    findAll: jest.fn().mockResolvedValue([mockProduct]),
    create: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockService }],
    }).compile()

    controller = module.get<ProductController>(ProductController)
    service = module.get<ProductService>(ProductService)
  })

  it('debería estar definido', () => {
    expect(controller).toBeDefined()
  })

  it('debería retornar todos los productos', async () => {
    const result = await controller.getAll()
    expect(result).toEqual([mockProduct])
    expect(service.findAll).toHaveBeenCalled()
  })

  it('debería crear un producto', async () => {
    const { id, ...dto } = mockProduct
    const result = await controller.create(dto)
    expect(result).toEqual(mockProduct)
    expect(service.create).toHaveBeenCalledWith(dto)
  })

  it('debería actualizar un producto', async () => {
    const updateData = { stock: 20 }
    const result = await controller.update(1, updateData)
    expect(result).toEqual({ affected: 1 })
    expect(service.update).toHaveBeenCalledWith(1, updateData)
  })
})