import { removeDuplicates } from '../../../utils';
import type { ParsedDefinition, ParsedDefinitionGroup, ParsedGlossary } from '../types';

import type { JitendexDefinition, JitendexGlossary, JitendexDefinitionGroup, JitendexTag } from './types';

import { isDefinitionGroup, isFormsTable, tagIsPartOfSpeech } from './types';

export function parseJitendex(data: any): ParsedGlossary {
  const topLevel: any = data.div.span[0];

  const parsed: ParsedGlossary = {
    containsDefinitionWithKanaRepresentation: false,
    partsOfSpeech: [],
    definitionGroups: [],
  };

  // From glossary definitions I've seen, span can contain:
  // - a ul and div, where the div holds the source info (JMdict + tatoeba (for example sentences))
  //   - eg. fuku, hashiru
  // - JUST a div: when all the parts of speech headers are the same I assume
  //   - eg. jitensha, keiyakusho
  // Choose ul if it exists
  if (Object.prototype.hasOwnProperty.call(topLevel, 'ul')) {
    topLevel.ul[0].li.forEach((glossary: JitendexGlossary) => parseGlossary(glossary, parsed));
  }
  if (Object.prototype.hasOwnProperty.call(topLevel, 'div')) {
    topLevel.div.forEach((glossary: JitendexGlossary) => parseGlossary(glossary, parsed));
  }

  // Remove duplicates
  parsed.partsOfSpeech = removeDuplicates(parsed.partsOfSpeech);

  return parsed;
};

function parseGlossary(glossary: JitendexGlossary, result: ParsedGlossary) {
  // TODO: Get the forms table maybe???
  if (isFormsTable(glossary)) return;

  // Ignore if it's not a definition group
  if (!isDefinitionGroup(glossary)) return;

  parseDefinitionGroup(glossary, result);
}

function parseDefinitionGroup(group: JitendexDefinitionGroup, result: ParsedGlossary) {
  const definitionGroup: ParsedDefinitionGroup = {
    partsOfSpeech: [],
    definitions: [],
  };

  // TODO: May need normalization (eg. for Godan verbs, will save them separately)
  // Get all parts of Speech
  group.span.forEach((el) => {
    if (tagIsPartOfSpeech(el)) {
      result.partsOfSpeech.push(el.$['data-sc-code']);
      definitionGroup.partsOfSpeech.push(el.$['data-sc-code']);
    } else {
      definitionGroup.groupTags ??= [];

      if (el.$['data-sc-code']) definitionGroup.groupTags.push(el.$['data-sc-code']);
      else definitionGroup.groupTags.push(el._);
    }
  });

  // Build definition
  if (group.div) parseDefinition(group.div[0], definitionGroup, result);
  else {
    group.ol[0].li.forEach((definitionElement) => {
      parseDefinition(definitionElement, definitionGroup, result);
    });
  }

  // Add to return
  result.definitionGroups.push(definitionGroup);
}

function parseDefinition(definitionElement: JitendexDefinition, group: ParsedDefinitionGroup, result: ParsedGlossary) {
  const definition: ParsedDefinition = {
    definition: ''
  };

  definitionElement.ul.forEach((val) => {
    // Skip example sentences for now
    if (val.$['data-sc-content'] === undefined) return;

    definition.definition = val.li.join('; ');
  });

  if (definitionElement.span) {
    definition.definitionTags = [];
    definitionElement.span.forEach((el) => {
      if (definitionIsKanaRepresentation(el)) result.containsDefinitionWithKanaRepresentation = true;
      if (el.$['data-sc-code']) definition.definitionTags?.push(el.$['data-sc-code']);
      else definition.definitionTags?.push(el._);
    });
  }

  group.definitions.push(definition);
}

// TODO:
function parseTags(span: JitendexTag[]) {

}

// TODO: hardcode???
function definitionIsKanaRepresentation(el: JitendexTag): boolean {
  if (el.$['data-sc-code'] && el.$['data-sc-code'] === 'uk') return true;
  return false;
}
