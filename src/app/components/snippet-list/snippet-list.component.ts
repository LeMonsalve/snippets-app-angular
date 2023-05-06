import {Component, inject, OnInit} from '@angular/core';
import {readDir} from "@tauri-apps/api/fs";
import {desktopDir} from "@tauri-apps/api/path";
import {SnippetsService} from "../../services/snippets.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-snippet-list',
  templateUrl: './snippet-list.component.html',
  styles: [`
    .snippet-list {
      height: 640px;
      max-height: 640px;
      overflow-y: auto;
      word-break: break-word;
    }
  `]
})
export class SnippetListComponent implements OnInit {
  private readonly snippetsService = inject(SnippetsService)

  files: string[] = []

  ngOnInit(): void {
    this.loadFiles().then(files => {
      let snippetsNames$: Observable<string[]> = this.snippetsService.getSnippetsNames()

      snippetsNames$.subscribe(snippetNames => {
        this.files = snippetNames
      })

      if (files.length > 0) {
        files.map(file => {
          return !file.name ? null : this.snippetsService.addSnippetName(file!.name)
        })
      }
    })
  }

  async loadFiles() {
    const desktopPath = await desktopDir()
    return await readDir(`${desktopPath}/snippets-app-files`)
  }
}
