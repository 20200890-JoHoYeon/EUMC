import { ApiProperty } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";
import { Expose } from "class-transformer";


export class SuccessCommonResponseDto<T> {
  @ApiProperty({ enum: Object.values(HttpStatus), description: '상태코드' })
  @Expose()
  readonly statusCode: number;

  @ApiProperty({ type: Boolean, description: '성공여부' })
  @Expose()
  readonly success: boolean;

  @ApiProperty({
    type: 'generic',
    description: 'object 또는 array 형식의 응답데이타가 옵니다.'
  })
  @Expose()
  data: T;
}
