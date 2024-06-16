import { Pipe, PipeTransform } from '@angular/core'
import { Libro } from 'domain/libro'

@Pipe({
  name: 'libroFilter',
  standalone: true,
  pure: true, // por defecto lo son
})
export class LibroFilter implements PipeTransform {

  transform(libros: Libro[], libroABuscar: string): Libro[] {
    return libros.filter(libro => !libroABuscar || this.coincide(libro.titulo, libroABuscar) || this.coincide(libro.autor, libroABuscar))
  }

  coincide(valor1: string, valor2: string) {
    return valor1
      .toLowerCase()
      .match(valor2.toLowerCase())
  }
}

