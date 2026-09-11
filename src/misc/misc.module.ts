import { Module } from '@nestjs/common';
import { MiscController } from './misc.controller';
import { FizzBuzzService } from './fizzbuzz.service';
import { FibonacciService } from './fibonacci.service';
import { EchoService } from './echo.service';
import { IsEvenService } from './is-even.service';
import { IsOddService } from './is-odd.service';
import { PalindromeService } from './palindrome.service';
import { UUIDService } from './uuid.service';

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
