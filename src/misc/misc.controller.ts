import { Controller, Get, Param } from '@nestjs/common';
import { FizzBuzzService } from '@/misc/fizzbuzz.service';
import { FibonacciService } from '@/misc/fibonacci.service';
import { EchoService } from '@/misc/echo.service';
import { IsEvenService } from '@/misc/is-even.service';
import { IsOddService } from '@/misc/is-odd.service';
import { PalindromeService } from '@/misc/palindrome.service';
import { UUIDService } from '@/misc/uuid.service';

@Controller('misc')
export class MiscController {
  constructor(
    private readonly fizzBuzzService: FizzBuzzService,
    private readonly fibonacciService: FibonacciService,
    private readonly echoService: EchoService,
    private readonly isEvenService: IsEvenService,
    private readonly isOddService: IsOddService,
    private readonly palindromeService: PalindromeService,
    private readonly uuidService: UUIDService,
  ) {}

  @Get('fizzbuzz/:number')
  async getFizzBuzz(@Param('number') number: string) {
    return this.fizzBuzzService.getFizzBuzz(number);
  }

  @Get('fibonacci/:number')
  async getFibonacci(@Param('number') number: string) {
    return this.fibonacciService.getFibonacci(number);
  }

  @Get('echo/:message')
  async getEcho(@Param('message') message: string) {
    return this.echoService.getEcho(message);
  }

  @Get('is-even/:number')
  async getIsEven(@Param('number') number: string) {
    return this.isEvenService.getIsEven(number);
  }

  @Get('is-odd/:number')
  async getIsOdd(@Param('number') number: string) {
    return this.isOddService.getIsOdd(number);
  }

  @Get('palindrome/:message')
  async getPalindrome(@Param('message') message: string) {
    return this.palindromeService.getIsPalindrome(message);
  }

  @Get('uuid/v4')
  async getUUIDv4() {
    return this.uuidService.getV4();
  }
}
