import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { SnippetFormComponent } from './components/snippet-form/snippet-form.component';
import { SnippetListComponent } from './components/snippet-list/snippet-list.component';
import { SnippetEditorComponent } from './components/snippet-editor/snippet-editor.component';
import { SnippetItemComponent } from './components/snippet-item/snippet-item.component';
import {FormsModule} from "@angular/forms";
import {MonacoEditorModule} from "ngx-monaco-editor";
import {HotToastModule} from "@ngneat/hot-toast";

@NgModule({
  declarations: [AppComponent, SnippetFormComponent, SnippetListComponent, SnippetEditorComponent, SnippetItemComponent],
	imports: [
		BrowserModule,
		FormsModule,
		MonacoEditorModule.forRoot(),
		HotToastModule.forRoot({
			position: 'bottom-right',
			duration: 2000,
			style: {
				background: '#2a2a2a',
				color: '#fff'
			},
		})
	],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
