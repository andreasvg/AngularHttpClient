import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BookTrackerError } from 'app/models/bookTrackerError';
import { TestDataFactory } from 'app/TestHelpers/testDataFactory';
import { Book } from 'app/models/book';

describe(`DataService`, () => {
  let httpTestingController: HttpTestingController;
  let dataService: DataService;
  const testDataFactory = new TestDataFactory();
  const BOOKS = testDataFactory.getBooks();

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ DataService ],
      declarations: [],
    }).compileComponents();

    dataService = TestBed.get(DataService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it(`should get all books`, () => {
    // Arrange:
    let returnedBooks: Book[];
    let error: BookTrackerError;

    // Act:
    dataService.getAllBooks().subscribe(
        (books: Book[]) => returnedBooks = books,
        (err: BookTrackerError) => error = err
    );
    let req: TestRequest = httpTestingController.expectOne('/api/books');
    expect(req.request.method).toEqual('GET');
    req.flush(BOOKS);

    // Assert:
    expect(returnedBooks).toBeTruthy();
    expect(returnedBooks.length).toBe(2);
    expect(error).toBeFalsy();

    httpTestingController.verify();
  });

  it(`getAllBooks should return custom error when HTTP error occurs`, fakeAsync(() => {
    let errResponse: BookTrackerError;

    // Arrange:
    const mockErrorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404, statusText: 'Not Found'
    });

    // Act:
    dataService.getAllBooks().subscribe(
      (resp) => fail('this should have been an error'), (err) => errResponse = err
    );
    const req = httpTestingController.expectOne('/api/books');
    req.flush(null, mockErrorResponse);

    // Assert:
    expect(errResponse).toBeTruthy();
    expect(errResponse.errorNumber).toBe(100);
    expect(errResponse.friendlyMessage).toBe('An error ocurred while retrieving data.');

    httpTestingController.verify();
  }));
});
