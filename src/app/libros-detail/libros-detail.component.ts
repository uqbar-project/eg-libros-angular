import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { LibroService } from 'app/libro.service'
import { Libro } from 'domain/libro'

@Component({
  selector: 'app-libros-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './libros-detail.component.html',
  styleUrl: './libros-detail.component.css'
})
export class LibrosDetailComponent {
  libro!: Libro
  libroEdicion!: Libro

  constructor(
    private libroService: LibroService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  navegarAHome() {
    this.router.navigate(['/master'])
  }

  ngOnInit() {
    this.route.params.subscribe((editarLibroParameters) => {
      const libro = this.libroService.getLibro(+(editarLibroParameters['id']))
      if (!libro) {
        this.libro = new Libro('', '', '', 0)
        this.libroEdicion = this.libro.generarCopia()
        this.navegarAHome()
      } else {
        this.libro = libro
        this.libroEdicion = libro.generarCopia()
      }
    })
  }

  aceptar() {
    this.libroService.actualizar(this.libroEdicion)
    this.navegarAHome()
  }

  cancelar() {
    this.navegarAHome()
  }

}
