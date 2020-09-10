import { Libro } from './domain/libro'

export default class StubLibroService {
  buscarLibros() {
    return [
      new Libro('Rayuela', 'Cortazar'),
      new Libro('Ficciones', 'Borges')
    ]
  }
}
