import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestion {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  genAI: boolean;
}
