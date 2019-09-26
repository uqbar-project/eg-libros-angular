import { TestBed, inject } from '@angular/core/testing'
import Libro from './domain/libro'
import { LibroService } from './libro.service'

describe('LibroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LibroService]
    })
  })

  it('should be created', inject([LibroService], (service: LibroService) => {
    expect(service).toBeTruthy()
  }))
  it('should find a known book', inject([LibroService], (service: LibroService) => {
    expect(buscarLibros(service.libros, 'Kryptonita')).toBeTruthy()
  }))
  it('should not find a not existing book', inject([LibroService], (service: LibroService) => {
    expect(buscarLibros(service.libros, 'Zarakatunga')).toBeFalsy()
  }))
})

function buscarLibros(libros: Libro[], tituloStartsWith: string) {
  return libros.some((libro: Libro) => libro.titulo.startsWith(tituloStartsWith))
}
