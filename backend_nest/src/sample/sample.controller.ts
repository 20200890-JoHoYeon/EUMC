import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SampleService } from './sample.service';
import { CreateSampleDto } from './dto/create-sample.dto';
import { UpdateSampleDto } from './dto/update-sample.dto';
import { ApiOperation, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('sample')
@ApiTags('샘플 API')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Post()
  @ApiOperation({ summary: '샘플 생성 API' })
  create(@Body() createSampleDto: CreateSampleDto) {
    return this.sampleService.create(createSampleDto);
  }

  @Get()
  findAll() {
    return this.sampleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '샘플 단일 조회 API' })
  @ApiParam({
    name: 'id',
    description: '샘플ID',
    required: true,
    example: '234234FD',
  })
  findOne(@Param('id') id: string) {
    return this.sampleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSampleDto: UpdateSampleDto) {
    return this.sampleService.update(+id, updateSampleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sampleService.remove(+id);
  }
}
