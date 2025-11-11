import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { PermissionSeeder } from "./permission.seeder";
import { RoleSeeder } from "./role.seeder";
import { UserSeeder } from "./user.seeder";
import { ProvinceSeeder } from "./province.seeder";

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);
  private isSeeded = false;

  constructor(
    private readonly permissionSeeder: PermissionSeeder,
    private readonly roleSeeder: RoleSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly provinceSeeder: ProvinceSeeder,
  ) {}

  async onApplicationBootstrap() {
    if (this.isSeeded) return;
    this.isSeeded = true;

    this.logger.log("...");
    this.logger.log("================= RUNNING SEEDERS =================");

    await this.permissionSeeder.run();
    await this.roleSeeder.run();
    await this.userSeeder.run();
    await this.provinceSeeder.run();

    this.logger.log("================= SEEDERS COMPLETED =================");
    this.logger.log("...");
  }
}
