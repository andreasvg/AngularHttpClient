import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { Book } from 'app/models/book';
import { Reader } from 'app/models/reader';
import { DataService } from 'app/core/data.service';
import { BookTrackerError } from 'app/models/bookTrackerError';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  private allBooksSubscription;
  allBooks: Book[];
  allReaders: Reader[];
  mostPopularBook: Book;

  constructor(private route: ActivatedRoute,
              private dataService: DataService,
              private title: Title) { }

  ngOnInit() {
    this.loadBooks();
    this.loadReaders();

    this.mostPopularBook = this.dataService.mostPopularBook;

    this.title.setTitle(`Book Tracker`);
  }

  loadBooks(): void {
    const resolveData: Book[] | BookTrackerError = this.route.snapshot.data['resolvedBooks'];

    if (resolveData instanceof BookTrackerError) {
      console.log(`Dashboard component error: ${resolveData.friendlyMessage}`);
    } else {
      this.allBooks = resolveData;
    }
  }

  loadReaders(): void {
    this.dataService.getAllReaders().subscribe(
      (readers) => this.allReaders = readers,
      (err: any) => console.log(err)
    );
  }

  deleteBook(bookID: number): void {
    this.dataService.deleteBookById(bookID)
      .subscribe(() => {
        const index: number = this.allBooks.findIndex(book => book.bookID === bookID);
        this.allBooks.splice(index, 1);

        console.log('Book deleted from server')
      },
      (err: any) => console.log(err));
  }

  deleteReader(readerID: number): void {
    console.warn(`Delete reader not yet implemented (readerID: ${readerID}).`);
  }

}
