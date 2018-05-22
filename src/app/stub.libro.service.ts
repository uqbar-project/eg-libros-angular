import Libro from './domain/libro'

export default class StubLibroService {
    libros = [new Libro('Rayuela', 'Cortazar'), new Libro('Ficciones', 'Borges') ]
}
