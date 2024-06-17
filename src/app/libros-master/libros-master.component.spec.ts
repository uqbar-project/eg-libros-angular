import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LibrosMasterComponent } from './libros-master.component'
import { getAllByTestId } from 'utils/test-utils'
import { RouterModule } from '@angular/router'
import { LibroService } from 'app/libro.service'
import StubLibroService from 'app/stub.libro.service'

describe('LibrosMasterComponent', () => {
  let component: LibrosMasterComponent
  let fixture: ComponentFixture<LibrosMasterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrosMasterComponent, RouterModule.forRoot([])],
      providers: [
        { provide: LibroService, useClass: StubLibroService }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(LibrosMasterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the component', (() => {
    expect(component).toBeTruthy()
  }))
  it('should return ok all books', (() => {
    const filasLibros = getAllByTestId(fixture, 'titulo')
    expect(filasLibros.length).toBe(2)
    expect(filasLibros[0].textContent.trim()).toBe('Rayuela')
  }))
  it('should filter ok books by title', (() => {
    component.libroABuscar = 'Fic'
    fixture.detectChanges()
    soloHayUnLibro(fixture, 'Ficciones')
  }))
  it('should filter ok books by author', (() => {
    component.libroABuscar = 'bor'
    fixture.detectChanges()
    soloHayUnLibro(fixture, 'Ficciones')
  }))
  
})

const soloHayUnLibro = (fixture: ComponentFixture<LibrosMasterComponent>, titulo: string) => {
  const filasLibros = getAllByTestId(fixture, 'titulo')
  expect(filasLibros.length).toBe(1)
  expect(filasLibros[0].textContent.trim()).toBe(titulo)
}
