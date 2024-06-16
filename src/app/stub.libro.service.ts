import { Libro } from 'domain/libro'

export default class StubLibroService {
  private libros: Libro[]

  constructor() {
    const rayuela = new Libro('Rayuela', 'Cortazar', 'Alfaguara', 200)
    rayuela.id = 1
    const ficciones = new Libro('Ficciones', 'Borges', 'Planeta', 550)
    ficciones.id = 2
    this.libros = [
      rayuela,
      ficciones,
    ]
  }

  buscarLibros() {
    return this.libros
  }

  getLibro(id: number) {
    return this.libros.find(libro => libro.id === id)
  }

  actualizar(libroActualizado: Libro) {
    const libro = this.getLibro(libroActualizado.id)
    if (!libro) throw new Error(`El libro con identificador ${libroActualizado.id} no existe`)
    libro.actualizarDesde(libroActualizado)
  }

}
