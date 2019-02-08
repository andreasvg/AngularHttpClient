import { TestDataFactory } from 'app/TestHelpers/testDataFactory';
import { of } from 'rxjs';
import { identifierModuleUrl } from '@angular/compiler';
import { EditBookComponent } from './edit-book.component';
import { async } from 'q';
import { TestBed, ComponentFixture, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'app/core/data.service';
import { FormsModule } from '@angular/forms';
import { convertToParamMap } from '@angular/router';

const activatedRouteMock = {
  snapshot: {
    paramMap: convertToParamMap({
        id: '3'
    })
  }
}

describe(`EditBookComponent`, () => {
  let mockDataService;
  let fixture: ComponentFixture<EditBookComponent>;
  const testDataFactory = new TestDataFactory();
  const BOOKS = testDataFactory.getBooks();

  beforeEach(async() => {
    mockDataService = jasmine.createSpyObj('DataService',
                      ['getAllBooks', 'getAllReaders', 'mostPopularBook', 'getBookById', 'getOldBookById']);
    mockDataService.getAllBooks.and.returnValue(of(BOOKS));
    mockDataService.getAllReaders.and.returnValue(of(testDataFactory.getReaders()));
    mockDataService.mostPopularBook.and.returnValue(of(BOOKS[0]));
    mockDataService.getBookById.and.returnValue(of(BOOKS[0]));
    mockDataService.getOldBookById.and.returnValue(of({ bookTitle: 'The Future Is Here', year: 1974}));

    TestBed.configureTestingModule({
      declarations: [ EditBookComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: DataService, useValue: mockDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditBookComponent);
    fixture.detectChanges();
  });

  it(`should be instantiated`, () => {
    // Assert:
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it(`should call getBookById with the correct parameter`, () => {
    fixture.detectChanges();

    // Assert:
    expect(mockDataService.getBookById).toHaveBeenCalledTimes(1);
    expect(mockDataService.getBookById).toHaveBeenCalledWith(3);
  });

  it(`should load the selectedBook property`, () => {
    fixture.detectChanges();

    // Assert:
    expect(fixture.componentInstance.selectedBook).toBe(BOOKS[0]);
    expect(fixture.componentInstance.selectedBook.author).toEqual('Alexander Dumas');
  });
});
