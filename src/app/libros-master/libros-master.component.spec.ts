import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { LibrosMasterComponent } from './libros-master.component'
import { getAllByTestId } from 'utils/test-utils'

describe('LibrosMasterComponent', () => {
  let component: LibrosMasterComponent
  let fixture: ComponentFixture<LibrosMasterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrosMasterComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(LibrosMasterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the component', waitForAsync(() => {
    expect(component).toBeTruthy()
  }))
  it('should return ok all books', waitForAsync(() => {
    const filasLibros = getAllByTestId(fixture, 'titulo')
    expect(filasLibros.length).toBe(2)
    expect(filasLibros[0].textContent.trim()).toBe('Rayuela')
  }))
  it('should filter ok books by title', waitForAsync(() => {
    component.libroABuscar = 'Fic'
    fixture.detectChanges()
    soloHayUnLibro(fixture, 'Ficciones')
  }))
  it('should filter ok books by author', waitForAsync(() => {
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
