import { Injectable } from '@angular/core'

import { Libro } from './domain/libro'

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  libros: Libro[]

  constructor() {
    this.libros = [
      new Libro('The design of every day things', 'Don Norman'),
      new Libro('El nombre del viento', 'Patrik Rufus'),
      new Libro('Cancion de Hielo y Fuego', 'R.R. Martin'),
      new Libro('Las venas abiertas de América Latina', 'Eduardo Galeano'),
      new Libro('A sangre fría', 'Truman Capote'),
      new Libro('100 años de soledad', 'Gabriel García Márquez'),
      new Libro('Kryptonita', 'Oyola'),
      new Libro('Historia de un loco', 'Katzenbach'),
      new Libro('Don´t make me think', 'Steve Krug'),
      new Libro('Management 3.0', 'Jurgen')
    ]
  }
}
