import { concatMap, delay, from, of, repeat } from 'rxjs'

export class Skills {
  current: HTMLInputElement
  skills: NodeListOf<HTMLInputElement>

  constructor() {
    this.current = document.getElementById('skill-1') as HTMLInputElement
    this.skills = document.querySelectorAll('[id|="skill"]')
    from(this.skills)
      .pipe(
        concatMap(skill => of(skill).pipe(delay(2500))),
        repeat()
      )
      .subscribe(skill => (skill.checked = true))
  }
}
