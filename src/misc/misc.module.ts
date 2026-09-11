import { Module } from '@nestjs/common';
import { MiscController } from '@/misc/misc.controller';
import { FizzBuzzService } from '@/misc/fizzbuzz.service';
import { FibonacciService } from '@/misc/fibonacci.service';
import { EchoService } from '@/misc/echo.service';
import { IsEvenService } from '@/misc/is-even.service';
import { IsOddService } from '@/misc/is-odd.service';
import { PalindromeService } from '@/misc/palindrome.service';
import { UUIDService } from '@/misc/uuid.service';

@Module({
  controllers: [MiscController],
  providers: [
    FizzBuzzService,
    FibonacciService,
    EchoService,
    IsEvenService,
    IsOddService,
    PalindromeService,
    UUIDService,
  ],
})
export class MiscModule {}
