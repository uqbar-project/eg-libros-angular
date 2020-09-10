import { Component, OnInit } from '@angular/core'

import { Libro } from './domain/libro'
import { LibroService } from './libro.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app'
  libroABuscar = ''
  libros: Libro[] = []

  constructor(public librosService: LibroService) { }

  ngOnInit(): void {
    this.libros = this.librosService.buscarLibros()
  }
}
