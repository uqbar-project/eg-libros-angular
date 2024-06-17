import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LibrosDetailComponent } from './libros-detail.component'
import { ActivatedRoute, Data, Router } from '@angular/router'
import { LibroService } from 'app/libro.service'
import StubLibroService from 'app/stub.libro.service'

function subscribeInvalido(fn: (value: Data) => void) {
  fn({ id: 5 })
}

describe('LibrosDetailComponent for a valid book', () => {
  let component: LibrosDetailComponent
  let fixture: ComponentFixture<LibrosDetailComponent>
  let routerSpy: jasmine.SpyObj<Router>
  let libroService!: StubLibroService
  let existingBookId: number
  let existingBookTitle: string

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    libroService = new StubLibroService()

    const book = libroService.buscarLibros()[1]
    existingBookId = book.id
    existingBookTitle = book.titulo

    const subscribeValido = (fn: (value: Data) => void) => {
      fn({ id: existingBookId })
    }

    await TestBed.configureTestingModule({
      imports: [LibrosDetailComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { params: { subscribe: subscribeValido } }},
        { provide: LibroService, useValue: libroService },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(LibrosDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  it('should show the title for a certain book', (() => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('[data-testid="titulo"]').value).toContain(existingBookTitle)
  }))
  it('should take effect when form submitted', (() => {
    const newValue = 'valorNuevo'
    const compiled = fixture.debugElement.nativeElement
    const tituloInput = compiled.querySelector('[data-testid="titulo"]')
    tituloInput.value = newValue
    tituloInput.dispatchEvent(new Event('input'))
    clickOn('aceptar')
    expect(libroService.getLibro(existingBookId)?.titulo).toBe(newValue)
  }))

  it('should navigate back to home when cancelled', (() => {
    clickOn('cancelar')
    shouldNavigateTo('/master')
  }))
  it('should navigate back to home when submitted', (() => {
    clickOn('aceptar')
    shouldNavigateTo('/master')
  }))

  function clickOn(buttonDataTestId: string) {
    const compiled = fixture.debugElement.nativeElement
    compiled.querySelector(`[data-testid='${buttonDataTestId}']`).click()
    fixture.detectChanges()
  }

  function shouldNavigateTo(url: string) {
    const [route] = routerSpy.navigate.calls.first().args[0]
    expect(route).toBe(url)
  }

})

describe('LibrosDetailComponent for an invalid book', () => {
  let fixture: ComponentFixture<LibrosDetailComponent>
  let routerSpy: jasmine.SpyObj<Router>

  const stubLibroService = new StubLibroService()

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    await TestBed.configureTestingModule({
      imports: [LibrosDetailComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { params: { subscribe: subscribeInvalido } }},
        { provide: LibroService, useValue: stubLibroService },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(LibrosDetailComponent)
    fixture.detectChanges()
  })

  it('should go back to home', (() => {
    const [route] = routerSpy.navigate.calls.first().args[0]
    expect(route).toBe('/master')
  }))
})