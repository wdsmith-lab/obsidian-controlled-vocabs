# Controlled Vocabs Obsidian Plugin

## Purpose

Controlled Vocabs is an Obsidian plugin that enables the creation and use of simple, user-defined vocabularies—similar to a lightweight taxonomy system. These vocabularies can be accessed anywhere in the Obsidian editor via the Command Palette, opening a modal to select and insert terms from your custom vocabularies. This helps standardize terminology, tags, or categories across your notes.

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
- Example:

```
Fruit: apple, banana, cherry, date
Colors: red, green, blue, yellow
```

---

## Usage Instructions

1. **Configure the Plugin**
   - Open the settings tab and set the path to your vocabulary file, output delimiter, and terms per line as desired.

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
- Future updates will add support for more advanced vocabulary management and file formats.

---

## License

See `LICENSE` for details.
