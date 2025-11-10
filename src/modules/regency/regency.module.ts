import { Module } from "@nestjs/common";
import { RegencyService } from "./regency.service";
import { RegencyController } from "./regency.controller";
import { ProvinceModule } from "../province/province.module";

@Module({
  imports: [ProvinceModule],
  controllers: [RegencyController],
  providers: [RegencyService],
  exports: [RegencyService],
})
export class RegencyModule {}
