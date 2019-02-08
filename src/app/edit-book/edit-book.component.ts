import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Book } from 'app/models/book';
import { DataService } from 'app/core/data.service';
import { OldBook } from 'app/models/oldBook';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styles: []
})
export class EditBookComponent implements OnInit {

  selectedBook: Book;

  constructor(private route: ActivatedRoute,
              private dataService: DataService) { }

  ngOnInit() {
    const bookID: number = +(this.route.snapshot.paramMap.get('id'));
    console.log(`book id is ${bookID}`);
    this.dataService.getBookById(bookID).subscribe(
      (book: Book) => {
        console.log('we now have the book');
        this.selectedBook = book;
      },
      (err: any) => console.log(err)
    );

/*     this.dataService.getOldBookById(bookID).subscribe(
      (book: OldBook) => console.log(book),
      (err: any) => console.log(err)
    ) */
  }

  setMostPopular(): void {
    this.dataService.setMostPopularBook(this.selectedBook);
  }

  saveChanges(): void {
    this.dataService.updateBook(this.selectedBook)
      .subscribe(
        () => {
          console.log('Book updated on server');
        },
        (err: any) => console.log(err)
      );
  }
}
