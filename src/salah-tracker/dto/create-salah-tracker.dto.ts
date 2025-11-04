import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// ✅ Represents a single rakat
export class CreateRakatDto {
  @IsBoolean()
  @IsNotEmpty()
  farz: boolean;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsOptional()
  markAsOffered?: string | null;
}

// ✅ Represents a single prayer (e.g., Fajr, Zuhr, etc.)
export class CreatePrayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRakatDto)
  rakats: CreateRakatDto[];

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  subtext: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

// ✅ Top-level Salah Record for a specific date
export class CreateSalahTrackerDto {
  @IsString()
  @IsNotEmpty()
  date: string; // Example: "2025-11-03"

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrayerDto)
  prayers: CreatePrayerDto[];
}
