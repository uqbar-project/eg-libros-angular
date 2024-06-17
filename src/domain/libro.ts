let lastId = 1

export class Libro {
  public id = lastId++

  constructor(
    public titulo: string,
    public autor: string,
    public editorial: string,
    public paginas: number
  ) {}

  generarCopia(): Libro {
    const nuevoLibro = new Libro(
      this.titulo,
      this.autor,
      this.editorial,
      this.paginas
    )
    nuevoLibro.id = this.id
    return nuevoLibro
  }

  actualizarDesde(nuevoLibro: Libro) {
    this.titulo = nuevoLibro.titulo
    this.autor = nuevoLibro.autor
    this.editorial = nuevoLibro.editorial
    this.paginas = nuevoLibro.paginas
  }
}
