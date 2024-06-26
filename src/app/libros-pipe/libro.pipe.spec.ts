import { Libro } from 'domain/libro'
import { LibroFilter } from './libro.pipe'

const libros = [new Libro('Rayuela', 'Cortazar', 'Alfaguara', 220), new Libro('Ficciones', 'Borges', 'Planeta', 310)]

describe('LibroPipe', () => {
  it('creates an instance', () => {
    const pipe = new LibroFilter()
    expect(pipe).toBeTruthy()
  })
  it('returns same collection of books when no filter is applied', () => {
    const pipe = new LibroFilter()
    const librosFiltrados = pipe.transform(libros, '')
    expect(librosFiltrados.length).toBe(2)
  })
  it('filters by title (case insensitive)', () => {
    encontrar('rayu', 'Rayuela')
  })
  it('filters by author (case insensitive)', () => {
    encontrar('bor', 'Ficciones')
  })
})

const encontrar = (criterioBusqueda: string, titulo: string) => {
  const pipe = new LibroFilter()
  const librosFiltrados: Libro[] = pipe.transform(libros, criterioBusqueda)
  expect(librosFiltrados.length).toBe(1)
  const lastBook = librosFiltrados.pop()
  expect(lastBook?.titulo).toBe(titulo)
}
