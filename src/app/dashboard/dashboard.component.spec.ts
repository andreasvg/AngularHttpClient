import { Book } from 'app/models/book';
import { BookTrackerErrorHandlerService } from 'app/core/book-tracker-error-handler.service';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { Reader } from 'app/models/reader';
import { TestDataFactory } from 'app/TestHelpers/testDataFactory';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DataService } from 'app/core/data.service';
import { Title } from '@angular/platform-browser';
import { RouterLinkStubDirective } from 'app/TestHelpers/TestStubs/routerLinkStub.directive';
import { convertToParamMap, ActivatedRoute } from '@angular/router';

describe(`DashboardComponent`, () => {
  let mockTitle, mockDataService;
  let fixture: ComponentFixture<DashboardComponent>;
  const testDataFactory = new TestDataFactory();
  const BOOKS = testDataFactory.getBooks();

  const activatedRouteMock = {
    snapshot: {
      data: {
        resolvedBooks: BOOKS
      }
    }
  };

  beforeEach(async() => {
    mockTitle = jasmine.createSpyObj('Title', ['setTitle']);
    mockDataService = jasmine.createSpyObj('DataService',
      ['getAllBooks', 'getAllReaders', 'mostPopularBook', 'deleteBookById']);
    mockDataService.getAllBooks.and.returnValue(of(BOOKS));
    mockDataService.getAllReaders.and.returnValue(of(testDataFactory.getReaders()));
    mockDataService.mostPopularBook.and.returnValue(BOOKS[0]);

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: DataService, useValue: mockDataService},
        { provide: Title, useValue: mockTitle}
      ],
      declarations: [ DashboardComponent, RouterLinkStubDirective ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
  });

  it(`should be instantiated`, () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it(`Should get all books from the service`, () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.allBooks.length).toBe(2);
    expect(fixture.componentInstance.allBooks[0].bookID).toBe(123);
  });

  it('should call the delete method in the DataService', fakeAsync(() => {
    // Arrange:
    fixture.detectChanges();
    mockDataService.deleteBookById.and.returnValue(of());

    // Act:
    fixture.componentInstance.deleteBook(BOOKS[0].bookID);
    tick();
    fixture.detectChanges();

    // Assert:
    expect(mockDataService.deleteBookById).toHaveBeenCalledTimes(1);
    expect(mockDataService.deleteBookById).toHaveBeenCalledWith(BOOKS[0].bookID);
  }));

  it(`should remove the deleted book from the component property`, fakeAsync(() => {
    // Arrange:
    fixture.detectChanges();
    mockDataService.deleteBookById.and.returnValue(of(null));
    const idToDelete = BOOKS[0].bookID;
    const numberOfBooks = fixture.componentInstance.allBooks.length;

    // make sure that the book to be deleted is in the component's allBooks property:
    let bookToDelete: Book;
    bookToDelete = fixture.componentInstance.allBooks.find(b => b.bookID === BOOKS[0].bookID);
    expect(bookToDelete).toBeTruthy();

    // Act:
    fixture.componentInstance.deleteBook(BOOKS[0].bookID);
    tick();
    fixture.detectChanges();

    // Assert:
    bookToDelete = fixture.componentInstance.allBooks.find(b => b.bookID === idToDelete);
    expect(bookToDelete).toBeFalsy();
    expect(fixture.componentInstance.allBooks.length).toBe(numberOfBooks - 1);
  }));

  it(`should call getAllReaders on init`, fakeAsync(() => {
    // Arrange:
    fixture.detectChanges();
    tick();

    // Assert:
    expect(mockDataService.getAllReaders).toHaveBeenCalled();
  }));
});
