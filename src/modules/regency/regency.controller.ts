import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { RegencyService } from "./regency.service";
import { CreateRegencyDto } from "./dto/create-regency.dto";
import { UpdateRegencyDto } from "./dto/update-regency.dto";
import { GetAllQuery } from "src/common/dtos/get-all-query.dto";
import { Public } from "src/common/decorators/public.decorator";

@Controller()
export class RegencyController {
  constructor(private readonly regencyService: RegencyService) {}

  @Post("regency")
  create(@Body() dto: CreateRegencyDto) {
    return this.regencyService.create(dto);
  }

  @Public()
  @Get("regencies")
  findAll(@Query() query: GetAllQuery) {
    return this.regencyService.findAll(query);
  }

  @Public()
  @Get("regency/:id")
  findOne(@Param("id") id: string) {
    return this.regencyService.findOne(+id);
  }

  @Patch("regency/:id")
  update(@Param("id") id: string, @Body() updateRegencyDto: UpdateRegencyDto) {
    return this.regencyService.update(+id, updateRegencyDto);
  }

  @Delete("regency/:id")
  remove(@Param("id") id: string) {
    return this.regencyService.remove(+id);
  }
}
