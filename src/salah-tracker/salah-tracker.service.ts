import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSalahTrackerDto } from './dto/create-salah-tracker.dto';
import { UpdateSalahTrackerDto } from './dto/update-salah-tracker.dto';
import { SalahRecord } from './schemas/salah-tracker.schema';

@Injectable()
export class SalahTrackerService {
  constructor(
    @InjectModel(SalahRecord.name)
    private readonly salahRecordModel: Model<SalahRecord>,
  ) {}

  // ✅ Create new record (prevent duplicate for same date & user)
  async create(createSalahTrackerDto: CreateSalahTrackerDto) {
    const {
      date,
      // , user
    } = createSalahTrackerDto;

    const existingRecord = await this.salahRecordModel
      .findOne({
        date,
        // , user
      })
      .exec();
    if (existingRecord) {
      throw new ConflictException(`A record already exists on date ${date}`);
      // throw new ConflictException(
      //   `A record already exists for user ${user} on date ${date}`,
      // );
    }

    const newRecord = new this.salahRecordModel(createSalahTrackerDto);
    return await newRecord.save();
  }

  async findAll() {
    return await this.salahRecordModel
      .find()
      // .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const record = await this.salahRecordModel
      .findById(id)
      // .populate('user', 'username email')
      .exec();

    if (!record)
      throw new NotFoundException(`Salah record with ID ${id} not found`);
    return record;
  }

  async update(id: string, updateSalahTrackerDto: UpdateSalahTrackerDto) {
    const updated = await this.salahRecordModel
      .findByIdAndUpdate(id, updateSalahTrackerDto, { new: true })
      .exec();

    if (!updated)
      throw new NotFoundException(`Salah record with ID ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.salahRecordModel.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`Salah record with ID ${id} not found`);
    return { message: 'Salah record deleted successfully' };
  }
}
