import qtVerses from '../data/qtVerses.json';

export interface BibleVerse {
    verse: string;
    reference: string;
}

export function getDailyVerse(): BibleVerse {
    const today = new Date();
    // Use day of year to rotate through the 10 verses consistently
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Rotate through the list
    const index = dayOfYear % qtVerses.length;

    return {
        verse: qtVerses[index].verse,
        reference: qtVerses[index].reference
    };
}
