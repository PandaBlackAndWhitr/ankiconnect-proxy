import { removeDuplicates } from '../../../utils';
import type { ParsedDefinitionGroup, ParsedGlossary } from '../types';

import type { JitendexDefinition, JitendexGlossary, JitendexDefinitionGroupTag, JitendexSingleDefinitionGroup } from './types';

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
    parseUlTopLevel(topLevel.ul[0].li as JitendexGlossary[], parsed);
  } else {
    // TODO: There may be form tables on 2nd, but ignore them for now
    const definition = topLevel.div[0] as JitendexSingleDefinitionGroup;

    // Single definition group:
    parseDefinitionGroup(definition.span, definition.div, parsed);
  }

  // Remove duplicates
  parsed.partsOfSpeech = removeDuplicates(parsed.partsOfSpeech);

  return parsed;
};

function parseUlTopLevel(elements: JitendexGlossary[], result: ParsedGlossary) {
  elements.forEach((el) => {
    // TODO: Get the forms table maybe???
    if (isFormsTable(el)) return;

    // Ignore if it's not a definition group
    if (!isDefinitionGroup(el)) return;

    parseDefinitionGroup(el.span, el.ol[0].li, result);
  });
}

function parseDefinitionGroup(posSpan: JitendexDefinitionGroupTag[], definitions: JitendexDefinition[], result: ParsedGlossary) {
  const definitionGroup: ParsedDefinitionGroup = {
    partsOfSpeech: [],
    definitions: [],
  };

  // TODO: May need normalization (eg. for Godan verbs, will save them separately)
  // Get all parts of Speech
  posSpan.forEach((el) => {
    if (tagIsPartOfSpeech(el)) {
      result.partsOfSpeech.push(el.$['data-sc-code']);
      definitionGroup.partsOfSpeech.push(el.$['data-sc-code']);
    } else {
      definitionGroup.groupTags ??= [];
      definitionGroup.groupTags.push(el._);
    }
  });

  // Build definition
  definitions.forEach((definitionElement) => {
    parseDefinition(definitionElement, definitionGroup);
  });

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
