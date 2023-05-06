import {Component, inject, OnInit} from '@angular/core';
import {SnippetsService} from "../../services/snippets.service";
import {debounceTime, Subject, Subscription} from "rxjs";
import {writeTextFile} from "@tauri-apps/api/fs";
import {desktopDir} from "@tauri-apps/api/path";
import {Snippet} from "../../interfaces/snippet.interface";

@Component({
  selector: 'app-snippet-editor',
  templateUrl: './snippet-editor.component.html',
  styles: []
})
export class SnippetEditorComponent implements OnInit {
  private readonly snippetService = inject(SnippetsService)

  selectedSnippet: Snippet = {}

  editorOptions = {
    theme: 'vs-dark',
    language: this.getLanguageFromExtension(this.selectedSnippet.extension ?? ''),
    automaticLayout: true
  }

  private debouncer: Subject<string> = new Subject<string>()
  private debouncerSubscription?: Subscription

  ngOnInit(): void {
    this.snippetService.getSelectedSnippet().subscribe(snippet => {
      this.selectedSnippet = snippet

      this.editorOptions = {
        ...this.editorOptions,
        language: this.getLanguageFromExtension(this.selectedSnippet.extension ?? ''),
      }

      console.log(this.editorOptions.language)
    })

    this.debouncerSubscription = this.debouncer
      .pipe( debounceTime(100) )
      .subscribe(code => this.saveCode(code))
  }

  onCodeChanged(code: string) {
    this.debouncer.next(code)
  }

  async saveCode(code: string) {
    const desktopPath = await desktopDir()
    await writeTextFile(`${desktopPath}/snippets-app-files/${this.selectedSnippet.name}`, code)
  }

  private getLanguageFromExtension(extension: string): string {
    const languages: { [key:string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown'
    }

    return languages[extension] ?? 'txt'
  }
}
