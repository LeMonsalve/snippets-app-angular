import {Component, inject, Input, OnInit} from '@angular/core'
import {SnippetsService} from "../../services/snippets.service";
import {Snippet} from "../../interfaces/snippet.interface";
import {desktopDir, join} from "@tauri-apps/api/path";
import {readTextFile, removeFile} from "@tauri-apps/api/fs";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
  selector: 'app-snippet-item',
  templateUrl: './snippet-item.component.html',
  styles: [
  ]
})
export class SnippetItemComponent implements OnInit {
  @Input() snippetName!: string

  private readonly snippetsService = inject(SnippetsService)
  private readonly toastService = inject(HotToastService)

  selectedSnippet: Snippet = {}
  isMouseover = false

  ngOnInit(): void {
    this.snippetsService.getSelectedSnippet().subscribe((snippet) => {
      this.selectedSnippet = snippet
    })
  }

  async selectSnippet() {
    const snippetCode = await readTextFile(await this.getFilePath())
    this.snippetsService.setSelectedSnippet({ name: this.snippetName, code: snippetCode })
  }

  async deleteSnippet(event: MouseEvent) {
    event.stopPropagation()
    const [accept] = await Promise.all([window.confirm(`Are you sure you want to delete ${this.snippetName}?`)])
    if (!accept) return

    await removeFile(await this.getFilePath()).then(() => {
      this.toastService.warning(`Snippet ${this.snippetName} deleted!`)
      this.snippetsService.removeAndUnselectSnippet(this.snippetName)
    })
  }

  async cancelSnippet(event: MouseEvent) {
    event.stopPropagation()
    this.snippetsService.setSelectedSnippet({})
  }

  private async getFilePath() {
    const desktopPath = await desktopDir()
    return await join(desktopPath, 'snippets-app-files', this.snippetName)
  }

  protected readonly onmouseover = onmouseover;
}
