import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageDto } from 'src/common/message.dto';
import { ServicioDto } from './dto/servicio.dto';
import { ServicioEntity } from './servicio.entity';
import { ServicioRepository } from './servicio.repository';

@Injectable()
export class ServicioService {
    constructor(
        @InjectRepository(ServicioEntity)
        private servicioRepository: ServicioRepository
    ){}

    async getAll(): Promise<ServicioEntity[]> {
        const list = await this.servicioRepository.find();
        if(!list.length){
            throw new NotFoundException(new MessageDto('la lista está vacía'))
        }
        return list;
    }

    async findById(id: number): Promise<ServicioEntity> {
        const servicio = await this.servicioRepository.findOne(id);
        if(!servicio) {
            throw new NotFoundException(new MessageDto('no existe'))
        }
        return servicio;
    }

    async findByNombre(nombre: string): Promise<ServicioEntity> {
        const servicio = await this.servicioRepository.findOne({nombre: nombre});
        return servicio;
    }

    async create(dto: ServicioDto): Promise<any> {
        const exists = await this.findByNombre(dto.nombre);
        if(exists) throw new BadRequestException(new MessageDto('El nombre ya existe'))
        const servicio = this.servicioRepository.create(dto);
        await this.servicioRepository.save(servicio);
        return new MessageDto(`servicio ${servicio.nombre} creado`);
    }

    async update(id: number, dto: ServicioDto): Promise<any> {
        const servicio = await this.findById(id);
        if(!servicio) throw new BadRequestException(new MessageDto('Esa ruta no existe'))   ;
        const exists = await this.findByNombre(dto.nombre);
        if(exists && exists.id !== id) throw new BadRequestException({message: 'El nombre ya existe'})
        dto.nombre? servicio.nombre = dto.nombre : servicio.nombre = servicio.nombre;
        dto.descripcion? servicio.descripcion = dto.descripcion : servicio.descripcion = servicio.descripcion;
        dto.precio? servicio.precio = dto.precio : servicio.precio = servicio.precio;
        await this.servicioRepository.save(servicio);
        return new MessageDto(`Servicio ${servicio.nombre} actualizado`);
    }

    async delete(id: number): Promise<any> {
        const servicio = await this.findById(id);
        await this.servicioRepository.delete(servicio);
        return new MessageDto(`Servicio ${servicio.nombre} eliminado`);
    }
}
