import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ProvinceService } from "./province.service";
import { CreateProvinceDto } from "./dto/create-province.dto";
import { UpdateProvinceDto } from "./dto/update-province.dto";
import { GetAllQuery } from "src/common/dtos/get-all-query.dto";
import { Public } from "src/common/decorators/public.decorator";

@Controller()
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Post("province")
  create(@Body() createProvinceDto: CreateProvinceDto) {
    return this.provinceService.create(createProvinceDto);
  }

  @Public()
  @Get("provinces")
  findAll(@Query() query: GetAllQuery) {
    return this.provinceService.findAll(query);
  }

  @Public()
  @Get("province/:id")
  findOne(@Param("id") id: string) {
    return this.provinceService.findOne(+id);
  }

  @Patch("province/:id")
  update(@Param("id") id: string, @Body() updateProvinceDto: UpdateProvinceDto) {
    return this.provinceService.update(+id, updateProvinceDto);
  }

  @Delete("province/:id")
  remove(@Param("id") id: string) {
    return this.provinceService.remove(+id);
  }
}
