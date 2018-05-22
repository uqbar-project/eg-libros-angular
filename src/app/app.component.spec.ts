import { TestBed, async, ComponentFixture } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { AppComponent } from './app.component'
import { LibroFilter } from './libro.pipe'
import { LibroService } from './libro.service'
import StubLibroService from './stub.libro.service'
import Libro from './domain/libro'

let fixture : ComponentFixture<AppComponent>
let app : AppComponent
let libroService: LibroService

describe('AppComponent', () => {
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LibroFilter
      ],
      imports: [
        FormsModule
      ],
      providers: [
        StubLibroService
      ]
    }).compileComponents()
    libroService = TestBed.get(StubLibroService)
    fixture = TestBed.createComponent(AppComponent)
    app = fixture.componentInstance
    app.librosService = libroService
    fixture.detectChanges()
  }))
  it('should create the app', async(() => {
    expect(app).toBeTruthy()
  }))
  it(`should have as title 'app'`, async(() => {
    expect(app.title).toEqual('app')
  }))
  it('should render title in a h1 tag', async(() => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('.card-title').textContent).toContain('Búsqueda de libros')
  }))
  it('should return ok books', async(() => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('td').textContent).toContain('Rayuela')
  }))
  it('should filter ok books by title', async(() => {
    app.libroABuscar = 'Fic'
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('td').textContent).not.toContain('Rayuela')
    expect(compiled.querySelector('td').textContent).toContain('Ficciones')
  }))
  it('should filter ok books by author', async(() => {
    app.libroABuscar = 'bor'
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('td').textContent).not.toContain('Rayuela')
    expect(compiled.querySelector('td').textContent).toContain('Ficciones')
  }))  
})
