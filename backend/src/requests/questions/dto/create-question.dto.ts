import { ArrayMaxSize, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestion {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @ArrayMaxSize(30) // FIXME setSize for whole Array
  // @MaxLength(80)      // FIXME setLenght for each Token
  tags: string[];

  @IsBoolean()
  @IsNotEmpty()
  useAI: boolean;
}
