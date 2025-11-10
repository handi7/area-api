import { IsNotEmpty } from "class-validator";

export class CreateVillageDto {
  @IsNotEmpty({ message: "Kelurahan harus diisi" })
  district_id: number;

  @IsNotEmpty({ message: "Kode harus diisi" })
  code: string;

  @IsNotEmpty({ message: "Nama harus diisi" })
  name: string;
}
