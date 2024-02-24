// TODO: Can I get this type from AnkiConnect's code???

import { AnkiPayload } from '../types';
import { PartsOfSpeech } from './jel/partsOfSpeech';

export interface AddNoteAnkiPayload extends AnkiPayload {
  params: {
    note: {
      fields: Record<string, string>,
      tags: string[],
      deckName: string,
      modelName: string,
      options: {
        allowDuplicate: boolean,
        duplicateScope: string,
        duplicateScopeOptions: {
          deckName: string | undefined | null,
          checkChildren: boolean,
          checkAllModels: boolean,
        }
      }
    },
  }
};

// Definition groups: they can contain parts of speech
export type ParsedDefinitionGroup = {
  partsOfSpeech: PartsOfSpeech[],
  // For stuff like: only applies to certain forms, etc
  groupTags?: string[],
  definitions: ParsedDefinition[],
  forms?: ParsedForms
}

export type ParsedDefinition = {
  definition: string,
  // TODO: optional, and honestly, probably don't want it???
  exampleSentence?: string,
};

// TODO: From the FormsTable (if it exists)
export type ParsedForms = {};

export type ParsedGlossary = {
  partsOfSpeech: PartsOfSpeech[],
  definitionGroups: ParsedDefinitionGroup[]
};