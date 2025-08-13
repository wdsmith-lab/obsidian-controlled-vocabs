# Lexicon Obsidian Plugin

## Purpose

Lexicon (formerly "Controlled Vocabs") is an Obsidian plugin that enables the creation and use of simple, user-defined vocabularies—similar to a lightweight taxonomy system. These vocabularies can be accessed anywhere in the Obsidian editor via the Command Palette, opening a modal to select and insert terms from your custom vocabularies. This helps standardize terminology, tags, or categories across your notes.

Currently, all vocabularies are defined in a single markdown file. Future versions will support more robust and flexible storage options.

---

## Features

- Define multiple vocabularies in a single markdown file
- Insert terms from any vocabulary using the Command Palette
- Multi-select modal with live preview and custom delimiter
- Settings tab for easy configuration
- Dynamic file search for vocabulary file selection
- Reload vocabularies without reloading the vault

---

## Alternatives

Not sure if this plugin is right for you?  You might be right!
See [a comparison guide with other plugins](Lexicon_Comparison_For_Users.md)

---

## Settings

Access the plugin settings via `Settings → Plugin Options → Controlled Vocabs`.

- **Output Delimiter**: The string used to separate terms when inserting them (default: `,`).
- **Vocabulary File**: Path to the markdown file containing your vocabularies. Use the file search to quickly select a file.
- **Terms Per Line**: Number of term buttons to display per line in the modal (default: `5`).

---

## Vocabulary File Format

The vocabulary file is a plain markdown file (e.g., `vocabulary.md`) with each line defining a vocabulary and its terms. Use the following format:

```
VocabularyName: term1, term2, term3
AnotherVocab: alpha, beta, gamma, delta
```

- Each line starts with the vocabulary name, followed by a colon (`:`), then a comma-separated list of terms.
- Blank lines are ignored.
- **Comments**: Lines beginning with a semicolon (`;`) are treated as comments and will be ignored by the plugin.
- Spaces are allowed.
- **Special Characters**: To use a literal comma (`,`), colon (`:`), or backslash (`\`) in a vocabulary name or term, you must escape it with a preceding backslash.
  - For a comma, use `\,`
  - For a colon, use `\:`
  - For a backslash, use `\\`
- Example:

```
; This is a comment, the line will be ignored by the plugin.
Snippet Types: Article, Book, Quote, Website, Audio, Video
Blog Topics: Tech-AI, Tech-Coding, Tech-General, Personal-General, Personal-Travel, Personal-Philosophical, Book Review
Book Statuses: Read, Unread, Reading, Dropped, Wishlist, Reviewing, Reviewed
Project Statuses: Brainstorming, Planning, Active, Reviewing, Paused, Cancelled, Completed
Advanced Usage: A Term\, with a comma, A Vocab Name\: with a colon, A term with a backslash \\
```


> [!TIP]
> ### Tips & Tricks!
> - **Tags**: `#book`, `#hotkey`, `#todo`, `#obsidian`
> - **Templater Snippets**: `<% tp.file.title %>`, `<% tp.date.now("YYYY-MM-DD") %>`, `<% tp.file.include("[[My Note]]") %>`
> - **Core Placeholders**: `{{date}}`, `{{time}}`, `{{title}}`
> - **Emoji Panel**: 😲,😎,✌️,📅,📊,✏️,📌,📍,✅
> 
> *Have other creative uses?*  [Share your own use
> case!](https://github.com/wdsmith-lab/obsidian-lexicon/discussions/categories/show-and-tell)


---

## Usage Instructions

1. **Configure the Plugin**
   - Open the settings tab and set the path to your vocabulary file, output delimiter, and terms per line in the modal display as desired.

2. **Define Your Vocabularies**
   - Edit your vocabulary file in the specified format (see above).

3. **Insert Terms**
   - Open the Command Palette (`Ctrl+P` or `Cmd+P`) and search for `Add from 'VocabularyName'`.
   - Select the command for the desired vocabulary.
   - In the modal, select one or more terms. Use the live preview to see the output.
   - Click `Apply` to insert the selected terms at the cursor position in your note.

4. **Reload Vocabularies**
   - If you update your vocabulary file, use the `Reload Vocabularies` command from the Command Palette to refresh the available vocabularies and terms without reloading the vault.

---

## Notes

- If you remove a vocabulary from the file, its command may remain in the Command Palette until you reload the plugin or vault.
- Future updates may add support for more advanced vocabulary management and file formats.

---

## Installing
Unzip the [latest release](https://github.com/wdsmith-lab/obsidian-lexicon/releases/latest) into your `<vault>/.obsidian/plugins/` folder.

## License

See `LICENSE` for details.

