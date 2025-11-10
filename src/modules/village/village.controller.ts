import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { VillageService } from "./village.service";
import { CreateVillageDto } from "./dto/create-village.dto";
import { UpdateVillageDto } from "./dto/update-village.dto";
import { GetAllQuery } from "src/common/dtos/get-all-query.dto";
import { Public } from "src/common/decorators/public.decorator";

@Controller()
export class VillageController {
  constructor(private readonly villageService: VillageService) {}

  @Post("village")
  create(@Body() createVillageDto: CreateVillageDto) {
    return this.villageService.create(createVillageDto);
  }

  @Public()
  @Get("villages")
  findAll(@Query() query: GetAllQuery) {
    return this.villageService.findAll(query);
  }

  @Public()
  @Get("village/:id")
  findOne(@Param("id") id: string) {
    return this.villageService.findOne(+id);
  }

  @Patch("village/:id")
  update(@Param("id") id: string, @Body() updateVillageDto: UpdateVillageDto) {
    return this.villageService.update(+id, updateVillageDto);
  }

  @Delete("village/:id")
  remove(@Param("id") id: string) {
    return this.villageService.remove(+id);
  }
}
