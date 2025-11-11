import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { SeederService } from "./seeder.service";
import { PermissionSeeder } from "./permission.seeder";
import { RoleSeeder } from "./role.seeder";
import { UserSeeder } from "./user.seeder";
import { ProvinceSeeder } from "./province.seeder";

@Module({
  imports: [PrismaModule],
  providers: [SeederService, PermissionSeeder, RoleSeeder, UserSeeder, ProvinceSeeder],
})
export class SeederModule {}
