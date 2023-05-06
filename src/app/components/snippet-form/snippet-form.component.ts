import {Component, inject} from '@angular/core'

//tauri
import {writeTextFile} from "@tauri-apps/api/fs"
import {desktopDir} from "@tauri-apps/api/path"
import {SnippetsService} from "../../services/snippets.service";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
  selector: 'app-snippet-form',
  templateUrl: './snippet-form.component.html',
  styles: [
  ]
})
export class SnippetFormComponent {
  private readonly snippetsService = inject(SnippetsService)
  private readonly toastService = inject(HotToastService)

  snippetName: string = ''

  async submit() {
    const desktopPath = await desktopDir()
    await writeTextFile(`${desktopPath}/snippets-app-files/${this.snippetName}`, '')
      .then(() => {
        this.snippetsService.addSnippetName(this.snippetName)
        this.snippetName = ''
      })
    this.toastService.success('Snippet created successfully!')
  }
}
