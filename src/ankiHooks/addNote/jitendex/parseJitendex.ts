import { removeDuplicates } from '../../../utils';
import type { ParsedDefinitionGroup, ParsedGlossary } from '../types';

import type { JitendexDefinition, JitendexGlossary, JitendexDefinitionGroupTag, JitendexSingleDefinitionGroup, JitendexDefinitionGroup } from './types';

import { isDefinitionGroup, isFormsTable, tagIsPartOfSpeech } from './types';

export function parseJitendex(data: any): ParsedGlossary {
  const topLevel: any = data.div.span[0];

  const parsed: ParsedGlossary = {
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
      definitionGroup.groupTags.push(el._);
    }
  });

  // Build definition
  if (group.div) parseDefinition(group.div[0], definitionGroup);
  else {
    group.ol[0].li.forEach((definitionElement) => {
      parseDefinition(definitionElement, definitionGroup);
    });
  }

  // Add to return
  result.definitionGroups.push(definitionGroup);
}

function parseDefinition(definitionElement: JitendexDefinition, result: ParsedDefinitionGroup) {
  definitionElement.ul.forEach((val) => {
    // Skip example sentences for now
    if (val.$['data-sc-content'] === undefined) return;

    result.definitions.push({
      definition: val.li.join('; '),
    });
  });
}
