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
$ npm install mdbootstrap --save
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
    return valor1.match(valor2) !== null
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

# La aplicación MVC

Ahora sí