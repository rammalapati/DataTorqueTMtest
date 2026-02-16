export class DateHelper {
  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  static formatDate(date: Date, format: 'YYYY-MM-DD' | 'DD/MM/YYYY' = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (format === 'DD/MM/YYYY') {
      return `${day}/${month}/${year}`;
    }
    return `${year}-${month}-${day}`;
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}