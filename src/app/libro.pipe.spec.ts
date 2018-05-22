import { LibroFilter } from './libro.pipe'
import Libro from './domain/libro'

const libros = [new Libro('Rayuela', 'Cortazar'), new Libro('Ficciones', 'Borges') ]

describe('LibroPipe', () => {
  it('create an instance', () => {
    const pipe = new LibroFilter()
    expect(pipe).toBeTruthy()
  })
  it('empty filter returns same collection of books', () => {
    const pipe = new LibroFilter()
    const librosFiltrados = pipe.transform(libros, "")
    expect(librosFiltrados.length).toBe(2)
  })
  it('filter by title works (case insensitive)', () => {
    const pipe = new LibroFilter()
    const librosFiltrados : Array<Libro> = pipe.transform(libros, "rayu")
    expect(librosFiltrados.length).toBe(1)
    const rayuela = librosFiltrados.pop()
    expect(rayuela.titulo).toBe("Rayuela")
  })
  it('filter by author works (case insensitive)', () => {
    const pipe = new LibroFilter()
    const librosFiltrados : Array<Libro> = pipe.transform(libros, "bor")
    expect(librosFiltrados.length).toBe(1)
    const ficciones = librosFiltrados.pop()
    expect(ficciones.titulo).toBe("Ficciones")
  })
})
