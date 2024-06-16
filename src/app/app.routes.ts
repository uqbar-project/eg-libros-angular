import { Routes } from '@angular/router'
import { LibrosDetailComponent } from './libros-detail/libros-detail.component'
import { LibrosMasterComponent } from './libros-master/libros-master.component'

export const routes: Routes = [
  { path: 'detail/:id', component: LibrosDetailComponent },
  { path: '**', component: LibrosMasterComponent },
]
