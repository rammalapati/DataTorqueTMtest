export class RandomHelper {
  static getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomZipCode(): string {
    return String(this.getRandomNumber(10000, 99999));
  }

  static getRandomPhoneNumber(): string {
    return `555-${this.getRandomNumber(100, 999)}-${this.getRandomNumber(1000, 9999)}`;
  }

  static pickRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}