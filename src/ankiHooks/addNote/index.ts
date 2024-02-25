// Parses the English dictionary definition, to make it more friendly
import { Builder, parseStringPromise } from 'xml2js';
import type { AnkiActionHook } from '../types';
import type { AddNoteAnkiPayload } from './types';
import { inspect } from 'util';
import { parseJitendex } from './jitendex/parseJitendex';
import { writeGlossaryField } from './writeGlossaryField';
import { defaultAddNoteMappingConfig } from './config';
import { handleTags } from './tags';

// TODO: Remove once config can be set
const config = defaultAddNoteMappingConfig;

export const AddNoteActionHook: AnkiActionHook<'addNote', AddNoteAnkiPayload> = {
  action: 'addNote',
  // TODO: Pass config item in
  callback: async (data: AddNoteAnkiPayload): Promise<AddNoteAnkiPayload> => {
    const note = data.params.note;

    const toParse = await parseStringPromise(note.fields[config.fields.glossary]);
    // console.log(inspect(toParse, false, null));

    // Parse, then write
    const glossary = parseJitendex(toParse);
    note.fields[config.fields.glossary] = writeGlossaryField(glossary);

    // Other fields:
    if (config.fields.partsOfSpeech !== undefined) {
      note.fields[config.fields.partsOfSpeech] = glossary.partsOfSpeech.join(',');
    }

    if (config.fields.displayKanaRepresentation !== undefined) {
      note.fields[config.fields.displayKanaRepresentation] = glossary.containsDefinitionWithKanaRepresentation ? '1' : '';
    }

    handleTags(glossary, config.tags, note);

    // Logging (used when debugging)
    // note.fields['English'] = new Builder().buildObject(toParse.div.span[0]);
    // console.log(inspect(data.params.note.fields[config.fields.glossary], false, null));
    // console.log('partsOfSpeech:', glossary.partsOfSpeech);

    return data;
  },
}