import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @IsString({ message: 'The group name must be a string.' })
  @MinLength(3, { message: 'The group name must have at least 3 characters.' })
  @MaxLength(50, { message: 'The group name cannot exceed 50 characters.' })
  name: string;
}