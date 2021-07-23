import { AppComponent } from './../app/app.component'
import { ComponentFixture } from '@angular/core/testing'

export const getAllByTestId = (fixture: ComponentFixture<AppComponent>, testId: string) => {
  const compiled = fixture.debugElement.nativeElement
  return compiled.querySelectorAll(`[data-testid="${testId}"]`)
}
