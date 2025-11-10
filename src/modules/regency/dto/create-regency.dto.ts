import { IsNotEmpty } from "class-validator";

export class CreateRegencyDto {
  @IsNotEmpty({ message: "Provinsi harus diisi" })
  province_id: number;

  @IsNotEmpty({ message: "Kode harus diisi" })
  code: string;

  @IsNotEmpty({ message: "Nama harus diisi" })
  name: string;
}
