import { Book } from '../models/book';
import { Reader } from '../models/reader';

export class TestDataFactory {

  getBooks(): Book[] {
    return   [
      {bookID: 123, title: 'The Count of Monte Christo', author: 'Alexander Dumas', publicationYear: 1870},
      {bookID: 456, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationYear: 1922},
    ];
  }

  getReaders(): Reader[] {
    return [
      {readerID: 123, name: 'John Smith', weeklyReadingGoal: 300, totalMinutesRead: 20},
      {readerID: 456, name: 'Charles Wilberforce', weeklyReadingGoal: 600, totalMinutesRead: 60},
      {readerID: 789, name: 'Mary Scott', weeklyReadingGoal: 800, totalMinutesRead: 10}
    ];
  }

}
