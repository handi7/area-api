import { IsNotEmpty } from "class-validator";

export class CreateProvinceDto {
  @IsNotEmpty({ message: "Kode harus diisi" })
  code: string;

  @IsNotEmpty({ message: "Nama harus diisi" })
  name: string;
}
