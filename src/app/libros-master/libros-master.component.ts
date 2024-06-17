import { Component } from '@angular/core'
import { Libro } from 'app/../domain/libro'
import { LibroService } from 'app/libro.service'
import { FormsModule } from '@angular/forms'
import { LibroFilter } from 'app/libros-pipe/libro.pipe'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-libros-master',
  standalone: true,
  imports: [FormsModule, LibroFilter, RouterModule],
  templateUrl: './libros-master.component.html',
  styleUrl: './libros-master.component.css'
})
export class LibrosMasterComponent {
  title = 'app'
  libroABuscar = ''
  libros: Libro[] = []

  constructor(public librosService: LibroService) {}

  ngOnInit(): void {
    this.libros = this.librosService.buscarLibros()
  }
}
