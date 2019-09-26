import { Component, OnInit } from '@angular/core'
import Libro from './domain/libro'
import { LibroService } from './libro.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app'
  librosService: LibroService
  libroABuscar: String = ''
  libros: Libro[] = []

  constructor(librosService: LibroService) {
    this.librosService = librosService
  }

  ngOnInit(): void {
    this.libros = this.librosService.libros
  }
}
