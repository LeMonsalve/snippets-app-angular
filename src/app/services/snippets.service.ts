import { Injectable } from '@angular/core'
import {BehaviorSubject, Observable, startWith} from "rxjs";
import {Snippet} from "../interfaces/snippet.interface";

@Injectable({
  providedIn: 'root'
})
export class SnippetsService {
  private snippetsNames: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  private selectedSnippet: BehaviorSubject<Snippet> = new BehaviorSubject<Snippet>({})

  getSnippetsNames(): Observable<string[]> {
    return this.snippetsNames.asObservable().pipe(startWith([]))
  }

  addSnippetName(name: string): void {
    const currentSnippetsNames = this.snippetsNames.value
    currentSnippetsNames.push(name)
    this.snippetsNames.next(currentSnippetsNames)
  }

  removeSnippet(name: string): void {
    const currentSnippetsNames = this.snippetsNames.value
    const index = currentSnippetsNames.indexOf(name)
    if (index > -1) {
      currentSnippetsNames.splice(index, 1)
    }
    this.snippetsNames.next(currentSnippetsNames)
  }

  removeAndUnselectSnippet(name: string): void {
    this.removeSnippet(name)
    this.setSelectedSnippet({})
  }

  getSelectedSnippet(): Observable<Snippet> {
    return this.selectedSnippet.asObservable()
  }

  setSelectedSnippet(snippet: Snippet): void {
    this.selectedSnippet.next({...snippet, extension: this.getSnippetExtension(snippet)})
  }

  getSnippetExtension(snippet: Snippet): string {
    return snippet.name?.split('.').pop() ??  ''
  }
}
