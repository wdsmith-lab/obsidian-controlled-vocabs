// FileSuggest using Obsidian's AbstractInputSuggest
import { AbstractInputSuggest, TAbstractFile } from 'obsidian';

class FileSuggest extends AbstractInputSuggest<TAbstractFile> {
    app: App;
    onSelectCallback?: (file: TAbstractFile) => void;
    constructor(inputEl: HTMLInputElement, app: App, onSelectCallback?: (file: TAbstractFile) => void) {
        super(app, inputEl);
        this.app = app;
        this.onSelectCallback = onSelectCallback;
    }
    getSuggestions(inputStr: string): TAbstractFile[] {
        const abstractFiles = this.app.vault.getAllLoadedFiles();
        return abstractFiles.filter(file =>
            file.path.toLowerCase().includes(inputStr.toLowerCase())
        );
    }
    renderSuggestion(file: TAbstractFile, el: HTMLElement) {
        el.setText(file.path);
    }
    selectSuggestion(file: TAbstractFile) {
        // inputEl is protected in AbstractInputSuggest, but accessible here
        const input = (this as any)["inputEl"] as HTMLInputElement | undefined;
        if (input) {
            input.value = file.path;
            // Trigger input event for Obsidian to pick up the change
            input.dispatchEvent(new Event('input'));
        }
        if (this.onSelectCallback) {
            this.onSelectCallback(file);
        }
        this.close();
    }
}
// filepath: main.ts
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

interface MyPluginSettings {
    mySetting: string;
    vocabularyFilePath: string;
    outputDelimiter: string;
    termsPerLine: number;  // Optional: Number of terms to display per line in the modal
}

interface Vocabulary {
    [key: string]: string[];
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default',
    vocabularyFilePath: 'vocabulary.md',
    outputDelimiter: ',',
    termsPerLine: 5  // Default to 5 terms per line
}

async function loadVocabularies(filePath: string): Promise<Vocabulary> {
    try {
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (!file || !(file instanceof TFile)) {
            new Notice(`Vocabulary file "${filePath}" not found.`);
            return {};
        }
        const content = await this.app.vault.read(file);
        const vocabularies: Vocabulary = {};
        //console.log(`Controlled Vocabs (content):`, content); // Log the content of the vocabulary file for debugging

        content.split('\n').forEach((line: string) => {
            if (line.trim() === '') return; // Skip empty lines
            const [key, value] = line.split(':');
            if (key && value) {
                vocabularies[key.trim()] = value.split(',').map((term: string) => term.trim());
            }
        });
        return vocabularies;
    } catch (e) {
        new Notice(`Controlled Vocabs: Error loading vocabulary file "${filePath}": ${e}`);
        console.log(`Controlled Vocabs: Error loading vocabulary file ` + filePath);
        return {};
    }
}

export default class ControlledVocabsPlugin extends Plugin {
    settings: MyPluginSettings;
    vocabularies: Vocabulary = {};

    async onload() {
        console.log(`Controlled Vocabs: Loading Controlled Vocabs Plugin`);
        await this.loadSettings();

        // Helper to register all vocab commands
        const registerVocabCommands = () => {
            // Remove previous commands by reloading the plugin (Obsidian doesn't provide a direct way to remove commands)
            // So we just add new ones; duplicates are ignored by Obsidian.
            for (const vocabName in this.vocabularies) {
                console.log(`Controlled Vocabs: Registering command for vocabulary: ${vocabName}`);
                this.addCommand({
                    id: `add-from-${vocabName.toLowerCase().replace(/\s+/g, '-')}`,
                    name: `Add from '${vocabName}'`,
                    editorCallback: (editor: Editor, view: MarkdownView) => {
                        new VocabModal(this.app, this, vocabName, this.vocabularies[vocabName], editor).open();
                    }
                });
            }
        };

        // Wait for layout to be ready before loading vocabularies and registering commands
        this.app.workspace.onLayoutReady(async () => {
            this.vocabularies = await loadVocabularies.call(this, this.settings.vocabularyFilePath);
            console.log("Controlled Vocabs: Vocabularies loaded:", this.vocabularies);
            registerVocabCommands();
        });

        // Add command to reload vocabularies
        console.log("Controlled Vocabs: Adding reload command");
        this.addCommand({
            id: 'reload-vocabularies',
            name: 'Reload Vocabularies',
            callback: async () => {
                const prevVocabNames = Object.keys(this.vocabularies);
                this.vocabularies = await loadVocabularies.call(this, this.settings.vocabularyFilePath);
                new Notice('Controlled Vocabs: Vocabularies reloaded.');
                console.log("Controlled Vocabs: Vocabularies reloaded:", this.vocabularies);
                registerVocabCommands();
                // Warn if any vocabularies were removed (potential orphaned commands)
                const currentVocabNames = Object.keys(this.vocabularies);
                const removed = prevVocabNames.filter(name => !currentVocabNames.includes(name));
                if (removed.length > 0) {
                    new Notice('Controlled Vocabs: Some commands for removed vocabularies may remain in the command palette until you disable/re-enable the plugin or reload the vault.');
                }
            }
        });

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new SampleSettingTab(this.app, this));

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.
        /*this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            console.log('click', evt);
        });*/

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        //this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class SampleSettingTab extends PluginSettingTab {
    plugin: ControlledVocabsPlugin;

    constructor(app: App, plugin: ControlledVocabsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Output Delimiter')
            .setDesc("Delimiter used to separate output values.")
            .addText(text => text
                .setPlaceholder(', ')
                .setValue(this.plugin.settings.outputDelimiter)
                .onChange(async (value) => {
                    this.plugin.settings.mySetting = value;
                    await this.plugin.saveSettings();
                }));



        new Setting(containerEl)
            .setName('Vocabulary File')
            .setDesc('Path to the markdown file containing your vocabularies.')
            .addSearch(search => {
                search.setValue(this.plugin.settings.vocabularyFilePath)
                    .setPlaceholder('Enter file path')
                    .onChange(async (value) => {
                        this.plugin.settings.vocabularyFilePath = value;
                        await this.plugin.saveSettings();
                    });
                new FileSuggest(search.inputEl, this.app, async (file) => {
                    // When a file is selected from the dropdown, update and save the setting
                    const value = file.path;
                    if (this.plugin.settings.vocabularyFilePath !== value) {
                        this.plugin.settings.vocabularyFilePath = value;
                        search.setValue(value); // update UI field if needed
                        await this.plugin.saveSettings();
                    }
                });
            });

        new Setting(containerEl)
            .setName('Terms Per Line')
            .setDesc("Terms to display per line in the modal.")
            .addText(text => {
                text.inputEl.type = "number";
                text.inputEl.min = "1";
                text.setValue(this.plugin.settings.termsPerLine.toString());
                text.onChange(async (value) => {
                    const intValue = parseInt(value, 10);
                    if (!isNaN(intValue) && intValue > 0) {
                        this.plugin.settings.termsPerLine = intValue;
                        await this.plugin.saveSettings();
                    }
                });
            });

    }
}

class VocabModal extends Modal {
    plugin: ControlledVocabsPlugin;
    vocabName: string;
    terms: string[];
    editor: Editor;
    selectedTerms: Set<string>;
    previewEl: HTMLElement;

    constructor(app: App, plugin: ControlledVocabsPlugin, vocabName: string, terms: string[], editor: Editor) {
        super(app);
        this.plugin = plugin;
        this.vocabName = vocabName;
        this.terms = terms;
        this.editor = editor;
        this.selectedTerms = new Set();
    }

    onOpen() {
        let { contentEl } = this;

        contentEl.createEl("h1", { text: `Add from ${this.vocabName}` });

        // Preview line
        this.previewEl = contentEl.createDiv({ cls: 'vocab-preview' });
        this.updatePreview();

        // Get termsPerLine from plugin settings (default to 5 if not found)
        let termsPerLine = 5;
        if (this.plugin && this.plugin.settings && typeof this.plugin.settings.termsPerLine === 'number') {
            termsPerLine = this.plugin.settings.termsPerLine;
        }

        // Get delimiter from settings (default to ',')
        let delimiter = ',';
        if (this.plugin && this.plugin.settings && typeof this.plugin.settings.outputDelimiter === 'string') {
            delimiter = this.plugin.settings.outputDelimiter;
        }

        // Store button references for toggling
        const buttonMap: Map<string, HTMLButtonElement> = new Map();

        for (let i = 0; i < this.terms.length; i += termsPerLine) {
            const row = contentEl.createDiv({ cls: 'vocab-row' });
            for (let j = i; j < i + termsPerLine && j < this.terms.length; j++) {
                const term = this.terms[j];
                let button = row.createEl("button", { text: term });
                buttonMap.set(term, button);
                button.addEventListener("click", () => {
                    if (this.selectedTerms.has(term)) {
                        this.selectedTerms.delete(term);
                        button.removeClass('selected');
                    } else {
                        this.selectedTerms.add(term);
                        button.addClass('selected');
                    }
                    this.updatePreview();
                });
            }
        }

        // Action buttons row
        const actionsRow = contentEl.createDiv({ cls: 'vocab-actions' });
        const applyBtn = actionsRow.createEl('button', { text: 'Apply' });
        const cancelBtn = actionsRow.createEl('button', { text: 'Cancel' });

        applyBtn.addEventListener('click', () => {
            this.applySelection = true;
            this.close();
        });
        cancelBtn.addEventListener('click', () => {
            this.applySelection = false;
            this.close();
        });

        // Add some basic styling for selected buttons and actions row
        const style = document.createElement('style');
        style.textContent = `
            .vocab-row { margin-bottom: 0.5em; }
            .vocab-row button {
                margin-right: 0.5em;
                margin-bottom: 0.3em;
            }
            .vocab-row button.selected {
                background-color: var(--interactive-accent, #4a90e2);
                color: white;
                border: 1px solid var(--interactive-accent, #4a90e2);
            }
            .vocab-preview {
                margin-bottom: 1em;
                font-style: italic;
            }
            .vocab-actions {
                margin-top: 1em;
                display: flex;
                gap: 1em;
                justify-content: flex-end;
            }
            .vocab-actions button {
                min-width: 80px;
                padding: 0.4em 1.2em;
                font-weight: bold;
            }
        `;
        contentEl.appendChild(style);
    }

    updatePreview() {
        if (!this.previewEl) return;
        // Get delimiter from settings (default to ',')
        let delimiter = ',';
        if (this.plugin && this.plugin.settings && typeof this.plugin.settings.outputDelimiter === 'string') {
            delimiter = this.plugin.settings.outputDelimiter;
        }
        const termsArr = Array.from(this.selectedTerms);
        this.previewEl.setText('Preview: ' + (termsArr.length > 0 ? termsArr.join(delimiter + ' ') : ''));
    }

    applySelection: boolean = false;
    onClose() {
        let { contentEl } = this;
        contentEl.empty();
        if (this.applySelection) {
            const termsArr = Array.from(this.selectedTerms);
            let delimiter = ',';
            if (this.plugin && this.plugin.settings && typeof this.plugin.settings.outputDelimiter === 'string') {
                delimiter = this.plugin.settings.outputDelimiter;
            }
            if (termsArr.length > 0) {
                this.editor.replaceSelection(termsArr.join(delimiter + ' '));
            }
        }
    }
}