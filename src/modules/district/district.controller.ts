import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { DistrictService } from "./district.service";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";
import { GetAllQuery } from "src/common/dtos/get-all-query.dto";
import { Public } from "src/common/decorators/public.decorator";

@Controller()
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Post("district")
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtService.create(createDistrictDto);
  }

  @Public()
  @Get("districts")
  findAll(@Query() query: GetAllQuery) {
    return this.districtService.findAll(query);
  }

  @Public()
  @Get("district/:id")
  findOne(@Param("id") id: string) {
    return this.districtService.findOne(+id);
  }

  @Patch("district/:id")
  update(@Param("id") id: string, @Body() updateDistrictDto: UpdateDistrictDto) {
    return this.districtService.update(+id, updateDistrictDto);
  }

  @Delete("district/:id")
  remove(@Param("id") id: string) {
    return this.districtService.remove(+id);
  }
}
