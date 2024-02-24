// -------------------------------------------
// GLOSSARY

import { PartsOfSpeech } from '../jel/partsOfSpeech';

// -------------------------------------------
export type JitendexGlossary = (JitendexDefinitionGroup | JitendexFormsTable | JitendexAttributions);

// -------------------------------------------
// GLOSSARY MISC TYPES
// -------------------------------------------
export type JitendexFormsTable = {
  $: {
    'data-sc-content': 'forms',
  },
  span: any[],
  // This is the table
  div: any[]
}

// function isFormsTable(definitionGroupElement: JitendexDefinitionGroup): definitionGroupElement is unknown {
export function isFormsTable(definitionGroupElement: JitendexGlossary): definitionGroupElement is JitendexFormsTable {
  return definitionGroupElement?.$?.['data-sc-content'] === 'forms';
}

type JitendexAttributions = {
  // _: 'sources:  | ',
  _: string,
  $: {
    'data-sc-content': 'attribution',
    style: string
  },
  a: any[],
}

// -------------------------------------------
// DEFINITION GROUPS
// -------------------------------------------
// TODO: This is specifically for when the parts of speech are included in the bullets
export type JitendexDefinitionGroup = {
  $?: undefined,

  span: JitendexDefinitionGroupTag[],
  ol: [{
    li: JitendexDefinition[],
  }],
};

export function isDefinitionGroup(group: JitendexGlossary): group is JitendexDefinitionGroup {
  return group?.$?.['data-sc-content'] === undefined;
}

export type JitendexSingleDefinitionGroup = {
  $?: undefined,
  span: JitendexDefinitionGroupTag[],

  div: [JitendexDefinition]
}

// -------------------------------------------
// DEFINITION GROUP TAGS
// -------------------------------------------
// TODO: Unused
// The part of speech
// export type JitendexPartsOfSpeechIdentifier = 'noun' | 'suffix' | 'verb';

// Contained as spans:
export type JitendexDefinitionGroupTag = {
  // What's displayed (ie. in between the tags)
  // _: JitendexPartsOfSpeechIdentifier,
  _: string,
  // Styling
  $: {
    // IF it's a part of speech: will have data-sc-code
    // 'n' for noun, n-suf for suffixes...
    'data-sc-code'?: string,
    // Description of the part of speech (for hovering)
    title: string,
    style: string,
  },
};

type PartOfSpeechDataCode = { $: { 'data-sc-code': PartsOfSpeech } };

export function tagIsPartOfSpeech(tag: JitendexDefinitionGroupTag): tag is JitendexDefinitionGroupTag & PartOfSpeechDataCode {
  return tag.$['data-sc-code'] !== undefined;
}

// -------------------------------------------
// DEFINITIONS
// -------------------------------------------
export type JitendexDefinition = {
  $: { style: string },
  // ExampleSentence can only ever be the LAST ELEMENT in the list
  ul: (JitendexDefinitionPhrase | JitendexDefinitionExampleSentenceWrapper)[]
};

type JitendexDefinitionPhrase = {
  $: {
    'data-sc-content': 'glossary',
    style: string
  },
  li: string[]
};

// -------------------------------------------
// EXAMPLE SENTENCES
// -------------------------------------------
type JitendexDefinitionExampleSentenceWrapper = {
  $: {
    style: string
    'data-sc-content'?: undefined,
  },
  // Comes in two parts, with class data-sc-content set on it:
  // - 'example-sentence-a': the Japanese portion
  // - 'example-sentence-b': the English translation
  li: JitendexDefinitionExampleSentence[],
};

type JitendexDefinitionExampleSentence = {
  // The actual sentence
  _: string,
  $: {
    'data-sc-content': 'example-sentence-a' | 'example-sentence-b'
  }
  // ONLY in example sentence A (Japanese portion)
  span?: any[],
  ruby: any[]
};
