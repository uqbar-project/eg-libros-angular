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
  it('should return Kryptonita book', inject([LibroService], (service: LibroService) => {
    const libros = service.libros
    const kryptonita = libros.find((libro: Libro) => libro.titulo.startsWith('Kryptonita'))
    expect(kryptonita).toBeTruthy()
  }))
})
