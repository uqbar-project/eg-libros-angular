# Búsqueda de libros básica

[![Build](https://github.com/uqbar-project/eg-libros-angular/actions/workflows/build.yml/badge.svg)](https://github.com/uqbar-project/eg-libros-angular/actions/workflows/build.yml) ![Coverage](./badges/eg-libros-angular/coverage.svg)

# Creación del proyecto

Lo creamos mediante Angular CLI,

```bash
ng new eg-libros-angular
```

## Material Design for Bootstrap

Luego necesitamos las dependencias de Material Design for Bootstrap

```bash
npm install mdbootstrap
```

Siguiendo [este tutorial](https://medium.com/codingthesmartway-com-blog/using-bootstrap-with-angular-c83c3cee3f4a) dentro de la propiedad styles del archivo _angular.json_ del raíz agregamos los archivos css:

```json
    "styles": [
        "src/styles.css",
        "./node_modules/mdbootstrap/css/bootstrap.min.css",
        "./node_modules/mdbootstrap/css/mdb.min.css",
        "./node_modules/mdbootstrap/css/style.css"
    ],
```

En la propiedad scripts ubicamos los archivos javascript de Material Design for Bootstrap:

```json
    "scripts": [
        "./node_modules/mdbootstrap/js/jquery.min.js",
        "./node_modules/mdbootstrap/js/bootstrap.min.js",
        "./node_modules/mdbootstrap/js/popper.min.js"
    ]
```

Otra opción es ubicarlos en el index, como se muestra a continuación:

```html
<body>
  <app-root></app-root>

  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.13.0/umd/popper.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.5.0/js/mdb.min.js"></script>

</body>
```

Esta opción requiere conexión online a internet, mientras que la opción anterior utiliza los archivos ya descargados en el directorio node_modules cuando lo instalamos con el npm.


### Configuración adicional

En el `package.json` tuvimos que agregar [esta configuración](https://stackoverflow.com/questions/72511039/autoprefixer-replace-color-adjust-to-print-color-adjust-the-color-adjust-short):

```json
  "overrides": {
    "autoprefixer": "10.4.5"
  },  
```

para que no nos tire este warning:

> (6:61388) from "autoprefixer" plugin: Replace color-adjust to print-color-adjust. The color-adjust shorthand is currently deprecated.

## Font Awesome

Agregamos la biblioteca de íconos [Font Awesome](https://fontawesome.com/get-started) para mostrar la lupa que simboliza la búsqueda en la pantalla. En el archivo _index.html_ agregamos el css (podríamos haberlo hecho también en el archivo _angular.json_ como contamos recién):

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

# Arquitectura general de la aplicación

![images](images/Arquitectura.png)

Además del esquema MVC que propone Angular (una vista principal app.component.html y su correspondiente controller app.component.ts), vamos a incorporar:

- nuestro clásico objeto de dominio, un Libro
- un objeto encargado de proveer la lista de libros, que es parte de la arquitectura de Angular: un LibroService
- y un objeto que será encargado de hacer el filtro cuando el usuario escriba un valor a buscar, LibroFilter que forma parte de la arquitectura de Angular llamada _pipe_ (hemos visto un _pipe_ predeterminado que es el que transforma un valor decimal según el formato de una configuración regional para que por ejemplo considere la coma decimal en lugar del punto)

# Service

Para crear el service utilizamos un comando propio de Angular CLI:

```bash
ng generate service libro
```

Esto genera el archivo libro.service.ts y su correspondiente test libro.service.spec.ts

La implementación es simplemente una lista _hardcoded_ de valores, aunque más adelante veremos que el origen de datos puede ser un servidor externo:

```typescript
export class LibroService {
  libros: Libro[]

  constructor() {
      this.libros = [
          new Libro('The design of every day things', 'Don Norman'),
          new Libro('El nombre del viento', 'Patrik Rufus'),
          ...
```

## Testeo unitario sobre el service

Podemos empezar a estudiar cómo funciona la inyección de dependencia del service en el test. Al configurar el fixture en el código asociado al _beforeEach_, registramos como provider al LibroService. Esto en el archivo _libro.service.spec.ts_:

```typescript
describe('LibroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LibroService]
    })
  })
```

Luego, en cada test recibimos la referencia al servicio mockeado para poder utilizarlo:

```typescript
  it('should be created', inject([LibroService], (service: LibroService) => {
    expect(service).toBeTruthy()
  }))
})
```

En este caso no es demasiado interesante lo que ocurre, el servicio mockeado coincide con el servicio original. Pero cuando tenemos que acceder a servicios remotos (y presumiblemente costosos), podemos reemplazar el comportamiento del service por otro más controlado para facilitar las pruebas unitarias. Y a su vez también podemos hacer esto para testear nuestros componentes de Angular. En ejemplos posteriores veremos más en profundidad este tema.

La implementación del servicio se haría sobre dos clases de equivalencia:

- la primera, el caso exitoso: el servicio nos devuelve un libro que existe
- la segunda, un caso no exitoso: el servicio no encuentra un libro

### Primer test

Escribimos el primer test:

```ts
  it('should find a known book', inject([LibroService], (service: LibroService) => {
    const existeLibro = libros.some((libro: Libro) => libro.titulo.startsWith('Kryptonita'))
    expect(existeLibro).toBeTruthy()
  }))
```

Como siempre, el uso del método `some` (similar al `any` de Wollok, o `exists` de Xtend) es preferible a:

- hacer un filter y preguntar si el size de la colección resultante es > 0
- hacer un filter y preguntar si la colección resultante no es empty
- preguntar si find !== null

porque estamos expresando lo mismo más explícitamente, queremos saber si **hay algún libro**.

### Refactor del test

Pero al empezar a codificar el segundo test nos damos cuenta que en ambos casos tenemos un mismo patrón de comportamiento: le pedimos los libros al servicio y queremos saber si alguno de los libros cumple que el título tenga una condición. Por eso vamos a crear una función:

```ts
function buscarLibros(libros: Libro[], tituloStartsWith: string) {
  return libros.some((libro: Libro) => libro.titulo.startsWith(tituloStartsWith))
}
```

o bien podemos armarla con la sintaxis de _lambdas_:

```ts
const buscarLibros = (libros: Libro[], tituloStartsWith: string) => {
  return libros.some((libro: Libro) => libro.titulo.startsWith(tituloStartsWith))
}
```

Después, en cada test, vamos a pedir que se cumpla y que no se cumpla respectivamente:

```ts
  it('should find a known book', inject([LibroService], (service: LibroService) => {
    expect(buscarLibros(service.libros, 'Kryptonita')).toBeTruthy()
  }))
  it('should not find a not existing book', inject([LibroService], (service: LibroService) => {
    expect(buscarLibros(service.libros, 'Zarakatunga')).toBeFalsy()
  }))
```

# Pipe

También creamos un pipe mediante un comando Angular CLI:

```bash
ng generate pipe libro
```

Esto genera el archivo libro.pipe.ts y su correspondiente test `libro.pipe.spec.ts`.

El pipe sabe hacer la búsqueda por título o autor en base al valor ingresado (cuando no hay nada ingresado no se aplica ningún filtro); esto lo resuelve la implementación del método transform que define la interfaz de un pipe de Angular:

```typescript
@Pipe({
  name: 'libroFilter'
})
export class LibroFilter implements PipeTransform {

  transform(libros: Libro[], libroABuscar: string): Libro[] {
    return libros.filter(libro =>
      !libroABuscar || this.coincide(libro.titulo, libroABuscar) || this.coincide(libro.autor, libroABuscar)
    )
  }

  coincide(valor1: string, valor2: string) {
    return valor1.toLowerCase().match(valor2.toLowerCase())
  }
}
```

Además se incorpora la annotation @Pipe a nuestra clase LibroFilter.

## Testeo unitario sobre el pipe

Para probar el pipe vamos a crear una lista de libros propia dentro de nuestro test (archivo _libro.pipe.spec.ts_):

```typescript
const libros = [new Libro('Rayuela', 'Cortazar'), new Libro('Ficciones', 'Borges') ]
```

Luego del típico test de creación del filtro exitosa, vamos a realizar estas pruebas:

- si no ingreso valores a filtrar debe devolver la misma lista de libros original
- al ingresar un valor, funciona la búsqueda por título sin tomar en cuenta mayúsculas / minúsculas. En nuestro ejemplo ingresamos "rayu" lo que debe traer el libro "Rayuela" de Cortázar.
- y al ingresar un valor, funciona la búsqueda por autor sin tomar en cuenta mayúsculas / minúsculas. En nuestro ejemplo ingresamos "bor" lo que debe traer el libro "Ficciones" de Borges.

```typescript
describe('LibroPipe', () => {
  ...
  it('returns same collection of books when no filter is applied', () => {
    const pipe = new LibroFilter()
    const librosFiltrados = pipe.transform(libros, '')
    expect(librosFiltrados.length).toBe(2)
  })
  it('filters by title (case insensitive)', () => {
    const pipe = new LibroFilter()
    const librosFiltrados : Libro[] = pipe.transform(libros, 'rayu')
    expect(librosFiltrados.length).toBe(1)
    const rayuela = librosFiltrados.pop()
    expect(rayuela.titulo).toBe('Rayuela')
  })
  it('filters by author (case insensitive)', () => {
    const pipe = new LibroFilter()
    const librosFiltrados : Libro[] = pipe.transform(libros, 'bor')
    expect(librosFiltrados.length).toBe(1)
    const ficciones = librosFiltrados.pop()
    expect(ficciones.titulo).toBe('Ficciones')
  })
})
```

Mmm... hay algo de código repetido, hagamos un pequeño refactor:

```typescript
  it('filters by title (case insensitive)', () => {
    encontrar('rayu', 'Rayuela')
  })
  it('filters by author (case insensitive)', () => {
    encontrar('bor', 'Ficciones')
  })
})

const encontrar = (criterioBusqueda: string, titulo: string) => {
  const pipe = new LibroFilter()
  const librosFiltrados: Libro[] = pipe.transform(libros, criterioBusqueda)
  expect(librosFiltrados.length).toBe(1)
  const lastBook = librosFiltrados.pop()
  expect(lastBook.titulo).toBe(titulo)
}
```

Mucho mejor, extraemos una función propia del test que haga las validaciones comunes.

# La aplicación MVC

En sí la aplicación tiene una vista _app.component.html_ con componentes propios de [Material Design for Bootstrap](https://mdbootstrap.com/), específicamente con dos tipos de binding:

- el input con binding bidireccional contra la propiedad libroABuscar del componente

```html
<div class="md-form">
    <input type="text" [(ngModel)]="libroABuscar" class="form-control">
    <label for="form1">Ingrese un valor a buscar</label>
</div>
```

- y la tabla de libros contra la propiedad libros del mismo componente principal

```html
<table class="table table-striped table-bordered table-hover">
  <tr class="cyan lighten-4">
    <th>Titulo</th>
    <th>Autor</th>
  </tr>
  <tr *ngFor="let libro of libros | libroFilter: libroABuscar">
    <td data-testid="titulo">{{libro.titulo}}</td>
    <td data-testid="autor">{{libro.autor}}</td>
  </tr>
</table>
```

El pipe libroFilter se aplica como filtro de los libros asociados.

El controller (_app.component.ts_) delega la búsqueda de los libros al service y sirve como contenedor del estado de la vista:

```typescript
export class AppComponent implements OnInit {
  title = 'app'
  libroABuscar = ''
  libros: Libro[] = []
  
  constructor(public librosService: LibroService) { }
  
  ngOnInit(): void {
    this.libros = this.librosService.libros
  }
}
```

El libro no tiene comportamiento, representa por el momento un objeto de dominio con los atributos título y autor.

# Testing del componente principal

En lugar de trabajar con el servicio que definimos, vamos a construir un stub de testing (_stub.libro.service.ts_):

```typescript
export default class StubLibroService {
  libros = [new Libro('Rayuela', 'Cortazar'), new Libro('Ficciones', 'Borges') ]
}
```

Ese stub lo vamos a inyectar dentro del componente principal AppComponent en la inicialización de nuestro fixture:

```typescript
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LibroFilter
      ],
      imports: [
        FormsModule
      ],
      providers: [
        StubLibroService
      ]
    }).compileComponents()
    libroService = TestBed.get(StubLibroService)
    fixture = TestBed.createComponent(AppComponent)
    app = fixture.componentInstance
    app.librosService = libroService
    fixture.detectChanges()
  }))
```

Mediante la configuración _providers_ agregamos el stub que luego se pasa a la referencia app que decora nuestra aplicación Angular. A partir de aquí podemos probar:

- que la búsqueda devuelve el libro Rayuela (que no forma parte del servicio original)
- que podemos filtrar por título (devuelve el libro "Ficciones" de Borges y no "Rayuela")
- que podemos filtrar por autor (el mismo resultado que en el test anterior)

```typescript
it('should return ok all books', async(() => {
  const filasLibros = getAllByTestId(fixture, 'titulo')
  expect(filasLibros.length).toBe(2)
  expect(filasLibros[0].textContent.trim()).toBe('Rayuela')
}))
it('should filter ok books by title', async(() => {
  app.libroABuscar = 'Fic'
  fixture.detectChanges()
  soloHayUnLibro(fixture, 'Ficciones')
}))
it('should filter ok books by author', async(() => {
  app.libroABuscar = 'bor'
  fixture.detectChanges()
  soloHayUnLibro(fixture, 'Ficciones')
}))
```

Para no trabajar con un identificador unívoco en libro, la técnica alternativa que utilizamos aquí fue:

- definir un `data-testid` general para identificar las columnas título y autor, en el html:

```html
<td data-testid="titulo">{{libro.titulo}}</td>
```

- en lugar de buscar un solo data-testid específico, recuperaremos todos los data-testid que contengan "título". Esto lo hacemos en una función auxiliar, en el archivo `test-utils.ts`:

```ts
export const getAllByTestId = (appComponent: any, testId: string) => {
  const compiled = appComponent.debugElement.nativeElement
  return compiled.querySelectorAll(`[data-testid="${testId}"]`)
}
```

- y por último, generamos una abstracción de más alto nivel, la función que nos permite saber si hay un solo libro cuyo título sea un valor específico

```ts
const soloHayUnLibro = (fixture: any, titulo: string) => {
  const filasLibros = getAllByTestId(fixture, 'titulo')
  expect(filasLibros.length).toBe(1)
  expect(filasLibros[0].textContent.trim()).toBe(titulo)
}
```

- podemos además validar la cantidad de libros que recibimos tras aplicar la búsqueda: de esa manera tenemos tests unitarios (el pipe, el service) y de integración (el componente que llama al pipe, el service no participa de esta integración ya que lo estamos mockeando, [Martin Fowler](https://martinfowler.com/bliki/UnitTest.html) diría que es un test social en cuanto al pipe pero solitario en cuanto al service)
