type DateInput = Date | { year: number, month: number };

// Cache for memoization
const cache = new Map<string, number>();

export function calculateYearsSince(date: DateInput, today: Date = new Date()): number {
  const cacheKey = `${date instanceof Date ? date.toISOString() : `${date.year}-${date.month}`}-${today.toISOString()}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const targetDate = date instanceof Date ? date : new Date(date.year, date.month - 1, 1);
  const years = today.getFullYear() - targetDate.getFullYear() - 
    ((today.getMonth() < targetDate.getMonth() || 
      (today.getMonth() === targetDate.getMonth() && today.getDate() < targetDate.getDate())) ? 1 : 0);
  
  cache.set(cacheKey, years);
  return years;
}

export function calculateRemainingMonths(birthDate: Date, today: Date): number {
  const cacheKey = `months-${birthDate.toISOString()}-${today.toISOString()}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  let remainingMonths = birthDate.getMonth() - today.getMonth();
  if (remainingMonths <= 0) {
    remainingMonths += 12;
  }
  if (birthDate.getDate() <= today.getDate()) {
    remainingMonths--;
  }

  cache.set(cacheKey, remainingMonths);
  return remainingMonths;
}

export function calculateRemainingDays(birthDate: Date, today: Date): number {
  const cacheKey = `days-${birthDate.toISOString()}-${today.toISOString()}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const days = birthDate.getDate() >= today.getDate()
    ? birthDate.getDate() - today.getDate()
    : new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate() + birthDate.getDate();

  cache.set(cacheKey, days);
  return days;
}

// Constants for better maintainability
const BIRTH_DATE = new Date('2009-08-11');
const JRE_START_DATE = { year: 2019, month: 11 };
const BACKEND_START_DATE = { year: 2021, month: 5 };

export function calculateDates(now: Date = new Date()): {
  birthday: {age: number, remainingDays: number, remainingMonths: number},
  experience: {jre: number, backend: number}
} {
  // Clear cache if it gets too large
  if (cache.size > 1000) {
    cache.clear();
  }

  return {
    birthday: {
      age: calculateYearsSince(BIRTH_DATE, now),
      remainingDays: calculateRemainingDays(BIRTH_DATE, now),
      remainingMonths: calculateRemainingMonths(BIRTH_DATE, now)
    },
    experience: {
      jre: calculateYearsSince(JRE_START_DATE, now),
      backend: calculateYearsSince(BACKEND_START_DATE, now)
    }
  };
}
