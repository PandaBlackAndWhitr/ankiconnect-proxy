import { PartsOfSpeech } from './jel/partsOfSpeech';

// TODO: Read from config, where to find fields/options
export type AddNoteMappingConfig = {
  fields: {
    glossary: string,
    // Kanji expression
    expression: string,
    partsOfSpeech?: string,
  }
  includePartsOfSpeechInTags?: {
    enabled: boolean,
    // Appends a prefix to the partsOfSpeechTags
    prefix?: string,
    // Conditions:
    // - false: will include parts of speech tags, even if they're not mapped
    // - 'ignore': will ignore unmapped parts of speech tags
    // - 'error': will throw an error if there are unmapped parts of speech tags
    onlyMapped: 'ignoreUnmapped' | 'error' | false,
    // Allows changing how the parts of speech are mapped
    map?: Record<PartsOfSpeech, string>,
  },
};

export const defaultAddNoteMappingConfig : AddNoteMappingConfig = {
  fields: {
    glossary: 'English',
    expression: 'Kanji',
    partsOfSpeech: 'Part of Speech',
  },
  includePartsOfSpeechInTags: {
    enabled: true,
    onlyMapped: false,
    prefix: 'pos::',
    /*
    map: {
      'n': 'Part_Of_Speech::Noun',
      'n-suf': 'Part_Of_Speech::Noun::Suffix',
      'ctr': 'Part_Of_Speech::Counter',
      '': 'Part_Of_Speech::Verb::Intransitive',
      'transitive': 'Part_Of_Speech::Verb::Transitive',

      // TODO: Converter to not include Godan info???
      '5-dan': 'Part_Of_Speech::Verb::Godan',
    },
    */
  },
}