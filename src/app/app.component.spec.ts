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
    existeTituloDeValor('Búsqueda de libros')
  }))
  it('should return ok books', async(() => {
    existeUnaColumnaDeValor('Rayuela')
  }))
  it('should filter ok books by title', async(() => {
    app.libroABuscar = 'Fic'
    fixture.detectChanges()
    noExisteUnaColumnaDeValor('Rayuela')
    existeUnaColumnaDeValor('Ficciones')
  }))
  it('should filter ok books by author', async(() => {
    app.libroABuscar = 'bor'
    fixture.detectChanges()
    noExisteUnaColumnaDeValor('Rayuela')
    existeUnaColumnaDeValor('Ficciones')
  }))  

  function existeTituloDeValor(valor: string) {
    existeTag('.card-title', valor)
  }
  
  function noExisteUnaColumnaDeValor(valor: string) {
    noExisteTag('td', valor)
  }
  
  function existeUnaColumnaDeValor(valor: string) {
    existeTag('td', valor)
  }
  
  function existeTag(tag: string, valor: string) {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector(tag).textContent).toContain(valor)
  }
  
  function noExisteTag(tag: string, valor: string) {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector(tag).textContent).not.toContain(valor)
  }  
})