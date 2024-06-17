import { Injectable } from '@angular/core'
import { Libro } from 'domain/libro'

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private libros: Libro[]

  constructor() {
    this.libros = [
      new Libro('The design of everyday things', 'Don Norman', 'Editto', 368),
      new Libro('El nombre del viento', 'Patrick Rothfuss', 'DAW Books', 613),
      new Libro('Canción de Hielo y Fuego', 'George R.R. Martin', 'Penguin Random House', 800),
      new Libro('Las venas abiertas de América Latina', 'Eduardo Galeano', 'Siglo XXI', 379),
      new Libro('A sangre fría', 'Truman Capote', 'Anagrama', 440),
      new Libro('100 años de soledad', 'Gabriel García Márquez', 'Sudamericana', 471),
      new Libro('Kryptonita', 'Leonardo Oyola', 'Literatura Random House', 224),
      new Libro('Historia del loco', 'John Katzenbach', 'Ballantine Books', 448),
      new Libro('Don\'t make me think', 'Steve Krug', 'New Riders Pub', 201),
      new Libro('Design Patterns', 'Jurgen', 'Addison-Wesley Professional', 416)
    ]
  }

  buscarLibros(): Libro[] {
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
