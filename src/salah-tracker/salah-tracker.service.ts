import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSalahTrackerDto } from './dto/create-salah-tracker.dto';
import { UpdateSalahTrackerDto } from './dto/update-salah-tracker.dto';
import { SalahRecord } from './schemas/salah-tracker.schema'; // 👈 adjust path if needed

@Injectable()
export class SalahTrackerService {
  constructor(
    @InjectModel(SalahRecord.name)
    private readonly salahRecordModel: Model<SalahRecord>,
  ) {}

  // ✅ Create new record
  async create(createSalahTrackerDto: CreateSalahTrackerDto) {
    const newRecord = new this.salahRecordModel(createSalahTrackerDto);
    return await newRecord.save();
  }

  // ✅ Find all records
  async findAll() {
    return await this.salahRecordModel.find().sort({ createdAt: -1 }).exec();
  }

  // ✅ Find one record by ID
  async findOne(id: string) {
    const record = await this.salahRecordModel.findById(id).exec();
    if (!record)
      throw new NotFoundException(`Salah record with ID ${id} not found`);
    return record;
  }

  // ✅ Update a record
  async update(id: string, updateSalahTrackerDto: UpdateSalahTrackerDto) {
    const updated = await this.salahRecordModel
      .findByIdAndUpdate(id, updateSalahTrackerDto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`Salah record with ID ${id} not found`);
    return updated;
  }

  // ✅ Remove a record
  async remove(id: string) {
    const deleted = await this.salahRecordModel.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`Salah record with ID ${id} not found`);
    return { message: 'Salah record deleted successfully' };
  }
}
