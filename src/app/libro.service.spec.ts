import { inject, TestBed } from '@angular/core/testing'

import { LibroService } from './libro.service'
import { Libro } from 'domain/libro'

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
    expect(buscarLibros(service.buscarLibros(), 'Kryptonita')).toBeTruthy()
  }))
  it('should not find a not existing book', inject([LibroService], (service: LibroService) => {
    expect(buscarLibros(service.buscarLibros(), 'Zarakatunga')).toBeFalsy()
  }))
})

const buscarLibros = (libros: Libro[], tituloStartsWith: string) => {
  return libros.some((libro: Libro) => libro.titulo.startsWith(tituloStartsWith))
}
