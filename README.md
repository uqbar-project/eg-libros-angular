# Búsqueda de libros básica

TODO: build de travis

# Creación del proyecto

Lo creamos mediante Angular CLI,

```bash
$ ng new eg-libros-angular
```

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


Font Awesome

<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
en el index.html

Creamos el service

```bash
ng generate service libro
```

# 