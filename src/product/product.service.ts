import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { ProductoDto } from './dto/producto.dto';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productoRepository: ProductRepository,
  ) {}

  async getAll(): Promise<ProductEntity[]> {
    const list = await this.productoRepository.find();
    if (!list.length) {
      throw new NotFoundException(new MessageDto('la lista está vacía'));
    }
    return list;
  }

  async findById(id: number): Promise<ProductEntity> {
    const producto = await this.productoRepository.findOne(id);
    if (!producto) {
      throw new NotFoundException(new MessageDto('no existe'));
    }
    return producto;
  }

  async findByNombre(nombre: string): Promise<ProductEntity> {
    const producto = await this.productoRepository.findOne({ nombre: nombre });
    return producto;
  }

  async create(dto: ProductoDto): Promise<any> {
    const exists = await this.findByNombre(dto.nombre);
    if (exists)
      throw new BadRequestException(new MessageDto('El nombre ya existe'));
    const producto = this.productoRepository.create(dto);
    await this.productoRepository.save(producto);
    return new MessageDto(`Ruta ${producto.nombre} creada`);
  }

  async update(id: number, dto: ProductoDto): Promise<any> {
    const producto = await this.findById(id);
    if (!producto)
      throw new BadRequestException(new MessageDto('Esa ruta no existe'));
    const exists = await this.findByNombre(dto.nombre);
    if (exists && exists.id !== id)
      throw new BadRequestException({ message: 'El nombre ya existe' });
    dto.nombre
      ? (producto.nombre = dto.nombre)
      : (producto.nombre = producto.nombre);
    dto.descripcion
      ? (producto.descripcion = dto.descripcion)
      : (producto.descripcion = producto.descripcion);
    await this.productoRepository.save(producto);
    return new MessageDto(`Ruta ${producto.nombre} actualizada`);
  }

  async delete(id: number): Promise<any> {
    const producto = await this.findById(id);
    await this.productoRepository.delete(producto);
    return new MessageDto(`Ruta ${producto.nombre} eliminada`);
  }
}
