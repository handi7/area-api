import { Module } from "@nestjs/common";
import { VillageService } from "./village.service";
import { VillageController } from "./village.controller";
import { DistrictModule } from "../district/district.module";

@Module({
  imports: [DistrictModule],
  controllers: [VillageController],
  providers: [VillageService],
})
export class VillageModule {}
