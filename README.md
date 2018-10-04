# Búsqueda de libros básica

[![Build Status](https://travis-ci.org/uqbar-project/eg-libros-angular.svg?branch=master)](https://travis-ci.org/uqbar-project/eg-libros-angular)

# Creación del proyecto

Lo creamos mediante Angular CLI,

```bash
$ ng new eg-libros-angular
```

## Material Design for Bootstrap

Luego necesitamos las dependencias de Material Design for Bootstrap
 
```bash
$ npm install mdbootstrap
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
        "./node_modules/mdbootstrap/js/jquery-3.3.1.min.js",
        "./node_modules/mdbootstrap/js/bootstrap.min.js",
        "./node_modules/mdbootstrap/js/popper.min.js",
        "./node_modules/mdbootstrap/js/mdb.min.js" 
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


## Font Awesome

Agregamos la biblioteca de íconos [Font Awesome](https://fontawesome.com/get-started) para mostrar la lupa que simboliza la búsqueda en la pantalla. En el archivo _index.html_ agregamos el css (podríamos haberlo hecho también en el archivo _angular.json_ como contamos recién):

```html
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
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
$ ng generate service libro
```

Esto genera el archivo libro.service.ts y su correspondiente test libro.service.spec.ts

La implementación es simplemente una lista _hardcoded_ de valores, aunque más adelante veremos que el origen de datos puede ser un servidor externo:

```typescript
export class LibroService {
  libros: Array<Libro>

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
  it('should return Kryptonita book', inject([LibroService], (service: LibroService) => {
    const libros = service.libros
    const kryptonita = libros.find((libro: Libro) => libro.titulo.startsWith('Kryptonita'))
    expect(kryptonita).toBeTruthy()
  }))
})
```

En este caso no es demasiado interesante lo que ocurre, el servicio mockeado coincide con el servicio original. Pero cuando tenemos que acceder a servicios remotos (y presumiblemente costosos), podemos reemplazar el comportamiento del service por otro más controlado para facilitar las pruebas unitarias. Y a su vez también podemos hacer esto para testear nuestros componentes de Angular. En ejemplos posteriores veremos más en profundidad este tema.


# Pipe

También creamos un pipe mediante un comando Angular CLI:

```bash
$ ng generate pipe libro
```

Esto genera el archivo libro.pipe.ts y su correspondiente test libro.pipe.spec.ts.

El pipe sabe hacer la búsqueda por título o autor en base al valor ingresado (cuando no hay nada ingresado no se aplica ningún filtro); esto lo resuelve la implementación del método transform que define la interfaz de un pipe de Angular:

```typescript
@Pipe({
  name: 'libroFilter'
})
export class LibroFilter implements PipeTransform {

  transform(libros: Array<Libro>, libroABuscar: string): any {
    return libros.filter(libro => 
      libroABuscar === "" || this.coincide(libro.titulo, libroABuscar) || this.coincide(libro.autor, libroABuscar)
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
  it('empty filter returns same collection of books', () => {
    const pipe = new LibroFilter()
    const librosFiltrados = pipe.transform(libros, "")
    expect(librosFiltrados.length).toBe(2)
  })
  it('filter by title works (case insensitive)', () => {
    const pipe = new LibroFilter()
    const librosFiltrados : Array<Libro> = pipe.transform(libros, "rayu")
    expect(librosFiltrados.length).toBe(1)
    const rayuela = librosFiltrados.pop()
    expect(rayuela.titulo).toBe("Rayuela")
  })
  it('filter by author works (case insensitive)', () => {
    const pipe = new LibroFilter()
    const librosFiltrados : Array<Libro> = pipe.transform(libros, "bor")
    expect(librosFiltrados.length).toBe(1)
    const ficciones = librosFiltrados.pop()
    expect(ficciones.titulo).toBe("Ficciones")
  })
})
```

Mmm... hay algo de código repetido, hagamos un pequeño refactor:

```typescript
  it('filter by title works (case insensitive)', () => {
    encontrar("rayu", "Rayuela")
  })
  it('filter by author works (case insensitive)', () => {
    encontrar("bor", "Ficciones")
  })
})

function encontrar(criterioBusqueda: string, titulo: string) {
  const pipe = new LibroFilter()
  const librosFiltrados: Array<Libro> = pipe.transform(libros, criterioBusqueda)
  expect(librosFiltrados.length).toBe(1)
  const rayuela = librosFiltrados.pop()
  expect(rayuela.titulo).toBe(titulo)
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
        <td>{{libro.titulo}}</td>
        <td>{{libro.autor}}</td>
    </tr>
</table>
```

El pipe libroFilter se aplica como filtro de los libros asociados.

El controller (_app.component.ts_) delega la búsqueda de los libros al service y sirve como contenedor del estado de la vista:

```typescript
export class AppComponent implements OnInit {
  title = 'app'
  librosService : LibroService
  libroABuscar : String = ''
  libros : Array<Libro> = []
  
  constructor(librosService: LibroService) {
    this.librosService = librosService
  }
  
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
  it('should return ok books', async(() => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('td').textContent).toContain('Rayuela')
  }))
  it('should filter ok books by title', async(() => {
    app.libroABuscar = 'Fic'
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('td').textContent).not.toContain('Rayuela')
    expect(compiled.querySelector('td').textContent).toContain('Ficciones')
  }))
  it('should filter ok books by author', async(() => {
    app.libroABuscar = 'bor'
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('td').textContent).not.toContain('Rayuela')
    expect(compiled.querySelector('td').textContent).toContain('Ficciones')
  }))
```

Aquí también tenemos una oportunidad para refactorizar:

```typescript
  it('should return ok books', async(() => {
    const compiled = fixture.debugElement.nativeElement
    existeUnaColumnaDeValor(compiled, 'Rayuela')
  }))
  it('should filter ok books by title', async(() => {
    app.libroABuscar = 'Fic'
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    noExisteUnaColumnaDeValor(compiled, 'Rayuela')
    existeUnaColumnaDeValor(compiled, 'Ficciones')
  }))
  it('should filter ok books by author', async(() => {
    app.libroABuscar = 'bor'
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    noExisteUnaColumnaDeValor(compiled, 'Rayuela')
    existeUnaColumnaDeValor(compiled, 'Ficciones')
  }))  
})

function noExisteUnaColumnaDeValor(compiled: any, valor: string) {
  expect(compiled.querySelector('td').textContent).not.toContain(valor)
}

function existeUnaColumnaDeValor(compiled: any, valor: string) {
  expect(compiled.querySelector('td').textContent).toContain(valor)
}
```

Un detalle no menor es que **elevamos el nivel de abstracción**: antes pedíamos que hubiera un tag `<td>` que cumpliera ciertas condiciones. Ahora hablamos del concepto de "columna", más cercano al usuario y menos a cómo se implementa (podría ser un div y no un td). Esto es fundamental para lograr que nuestros tests mejoren en mantenibilidad. 

Un nuevo paso en nuestro refactor sería:

- evitar la duplicación en cada test de hacer `const compiled = fixture.debugElement.nativeElement`. Para eso, podemos aprovechar la variable fixture cuyo scope está enmarcado por el describe. Escribiremos funciones dentro del describe entonces, para no tener que pasar el fixture como parámetro
- además, hay otro test que valida un título por la clase cardTitle. Haremos una función más general que buscará un tag (o clase) dentro del html resuelto. Como resultado, cada test queda mucho más chico:

```typescript
  it('should render title in a h1 tag', async(() => {
    existeTituloDeValor('Búsqueda de libros')
  }))
  it('should return ok books', async(() => {
    existeUnaColumnaDeValor('Rayuela')
  }))
  it('should filter ok books by title', async(() => {
    app.libroABuscar = 'Fic'
    fixture.detectChanges()
    noExisteUnaColumnaDeValor('Rayuela')
    existeUnaColumnaDeValor('Ficciones')
  }))
  it('should filter ok books by author', async(() => {
    app.libroABuscar = 'bor'
    fixture.detectChanges()
    noExisteUnaColumnaDeValor('Rayuela')
    existeUnaColumnaDeValor('Ficciones')
  }))  

  function existeTituloDeValor(valor: string) {
    existeTag('.card-title', valor)
  }
  
  function noExisteUnaColumnaDeValor(valor: string) {
    noExisteTag('td', valor)
  }
  
  function existeUnaColumnaDeValor(valor: string) {
    existeTag('td', valor)
  }
  
  function existeTag(tag: string, valor: string) {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector(tag).textContent).toContain(valor)
  }
  
  function noExisteTag(tag: string, valor: string) {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector(tag).textContent).not.toContain(valor)
  }  
})
```