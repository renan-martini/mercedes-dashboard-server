export class DateUtility {
  static today() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  static lastSunday() {
    const date = this.today();
    const dayOfWeek = date.getDay();
    const firstDayOfWeek = new Date(date);

    firstDayOfWeek.setDate(date.getDate() - dayOfWeek);

    return firstDayOfWeek;
  }

  static nextSunday() {
    const date = this.today();
    const dayOfWeek = date.getDay();
    const lastDayOfWeek = new Date(date);
    const diff = 7 - dayOfWeek;

    lastDayOfWeek.setDate(date.getDate() + diff);

    return lastDayOfWeek;
  }

  static firstDayOfTheMonth() {
    const date = this.today();
    date.setDate(1);
    return date;
  }

  static firstDayOfTheNextMonth() {
    const today = this.today();
    const firstDayOfTheNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1,
    );

    return firstDayOfTheNextMonth;
  }

  static nextDay(date = this.today()) {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return nextDay;
  }

  static setHour(date: Date, hour: string) {
    return new Date(`${date.toISOString().split('T')[0]}T${hour}Z`);
  }

  static setDayOfTheMonth(date = this.today(), day: number, hour: string) {
    const copyDate = new Date(date);
    copyDate.setDate(day);
    return this.setHour(copyDate, hour);
  }

  static nextMonth(date = this.today()) {
    const copyDate = new Date(date);
    copyDate.setMonth(copyDate.getMonth() + 1);

    return copyDate;
  }

  static getDayOfThisWeek(
    date = this.today(),
    dayOfWeek: number,
    hour: string,
  ) {
    const dateCopy = new Date(date);
    const dayOfWeekActual = dateCopy.getDay();
    const specificDayOfWeek = new Date(dateCopy);

    specificDayOfWeek.setDate(date.getDate() - (dayOfWeekActual - dayOfWeek));

    return this.setHour(specificDayOfWeek, hour);
  }

  static getDateOfYear(date: Date, hour: string, year: number) {
    const copyDate = new Date(date);
    copyDate.setFullYear(year);

    return this.setHour(copyDate, hour);
  }
}
