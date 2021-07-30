import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { getAllByTestId } from 'src/utils/test-utils'

import { AppComponent } from './app.component'
import { LibroFilter } from './libro.pipe'
import { LibroService } from './libro.service'
import StubLibroService from './stub.libro.service'

import './app.module'

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>
  let app: AppComponent
  let libroService: LibroService

  beforeEach(waitForAsync(() => {
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
  it('should create the app', waitForAsync(() => {
    expect(app).toBeTruthy()
  }))
  it('should return ok all books', waitForAsync(() => {
    const filasLibros = getAllByTestId(fixture, 'titulo')
    expect(filasLibros.length).toBe(2)
    expect(filasLibros[0].textContent.trim()).toBe('Rayuela')
  }))
  it('should filter ok books by title', waitForAsync(() => {
    app.libroABuscar = 'Fic'
    fixture.detectChanges()
    soloHayUnLibro(fixture, 'Ficciones')
  }))
  it('should filter ok books by author', waitForAsync(() => {
    app.libroABuscar = 'bor'
    fixture.detectChanges()
    soloHayUnLibro(fixture, 'Ficciones')
  }))
})

function soloHayUnLibro(fixture: ComponentFixture<AppComponent>, titulo: string) {
  const filasLibros = getAllByTestId(fixture, 'titulo')
  expect(filasLibros.length).toBe(1)
  expect(filasLibros[0].textContent.trim()).toBe(titulo)
}
