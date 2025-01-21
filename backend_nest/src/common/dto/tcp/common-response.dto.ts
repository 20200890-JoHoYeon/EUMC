import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

/**
 * 사용안하는듯함
 */
export class CommonRequestDto {
  @ApiProperty({
    description: '',
    required: false,
  })
  @IsString()
  funcKey: string;
  @ApiProperty({
    description: '',
    required: false,
  })
  @IsString()
  funcName: string;
  @ApiProperty({
    description: '',
    required: false,
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: '',
    required: false,
  })
  @IsString()
  message: string;
}
