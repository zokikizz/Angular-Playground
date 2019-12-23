import { Injectable, Inject } from '@nestjs/common';
import { CreateCatDto } from './create-cat.dto';
import { Cat } from './cat.entity';

@Injectable()
export class CatsService {
    constructor(
        @Inject('CATS_REPOSITORY') private readonly catsRepository: typeof Cat) {}

    async findAll(): Promise<Cat[]> {
        return await this.catsRepository.findAll<Cat>();
    }


    async create(createCatDto: CreateCatDto): Promise<Cat> {
        const cat = new Cat();
        cat.name = createCatDto.name;
        cat.breed = createCatDto.breed;
        cat.age = createCatDto.age;

        return await cat.save();
    }
}
