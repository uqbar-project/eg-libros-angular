import { LibroFilter } from './libro.pipe'
import Libro from './domain/libro'

const libros = [new Libro('Rayuela', 'Cortazar'), new Libro('Ficciones', 'Borges')]

describe('LibroPipe', () => {
  it('create an instance', () => {
    const pipe = new LibroFilter()
    expect(pipe).toBeTruthy()
  })
  it('empty filter returns same collection of books', () => {
    const pipe = new LibroFilter()
    const librosFiltrados = pipe.transform(libros, '')
    expect(librosFiltrados.length).toBe(2)
  })
  it('filter by title works (case insensitive)', () => {
    encontrar('rayu', 'Rayuela')
  })
  it('filter by author works (case insensitive)', () => {
    encontrar('bor', 'Ficciones')
  })
})

function encontrar(criterioBusqueda: string, titulo: string) {
  const pipe = new LibroFilter()
  const librosFiltrados: Libro[] = pipe.transform(libros, criterioBusqueda)
  expect(librosFiltrados.length).toBe(1)
  const lastBook = librosFiltrados.pop()
  expect(lastBook.titulo).toBe(titulo)
}

