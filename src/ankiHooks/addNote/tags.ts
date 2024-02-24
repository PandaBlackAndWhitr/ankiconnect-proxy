import { removeDuplicates } from '../../utils';
import { AddNoteMappingConfig } from './config';
import { AddNoteAnkiPayload, ParsedGlossary } from './types';

type TagsConfig = AddNoteMappingConfig['tags'];
type PartsOfSpeechConfig = Exclude<AddNoteMappingConfig['tags']['partsOfSpeech'], undefined>;

export function handleTags(glossary: ParsedGlossary,
  config: TagsConfig,
  note: AddNoteAnkiPayload['params']['note'],
) {
  if (config.partsOfSpeech) handlePartsOfSpeech(glossary, config.partsOfSpeech, note);
  if (config.additional) config.additional.forEach((val) => note.tags.push(val));

  note.tags = removeDuplicates(note.tags);
}

function handlePartsOfSpeech(glossary: ParsedGlossary,
  config: PartsOfSpeechConfig,
  note: AddNoteAnkiPayload['params']['note'],
): void {
  let posTags: string[] = [];

  if (!config.map && config.onlyMapped === 'error') throw new Error('No mappings for parts of speech defined (perhaps `includePartsOfSpeechInTags.onlyMapped` should be false?)');

  const prefix = config.prefix ?? '';
  const addToTags = (val: string) => note.tags.push(`${prefix}${val}`);

  // Mapping logic:
  if (config.map) {
    posTags = glossary.partsOfSpeech.reduce((prev, val) => {
      // If val not in map, and we're supposed to throw on that:
      if (!Object.prototype.hasOwnProperty.call(config.map, val)) {
        if (config.onlyMapped === 'error') {
          throw new Error(`Parse failed: unknown part of speech "${val}".`);

          // TODO: Be able to access kanji expression without needing to access FULL config
          // throw new Error(`Parse failed: ${note.fields[fullConfig.fields.expression]} has unknown part of speech "${val}".`);
        }

        if (config.onlyMapped === false) {
          addToTags(val);
          return prev;
        }
      }

      addToTags((config.map as Exclude<PartsOfSpeechConfig['map'], undefined>)[val]);
      return prev;
    }, posTags);
  } else {
    if (config.onlyMapped === false) {
      glossary.partsOfSpeech.forEach(addToTags);
    }
  }
}