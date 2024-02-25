import type { ParsedDefinition, ParsedDefinitionGroup, ParsedGlossary } from './types';

export function writeGlossaryField(glossary: ParsedGlossary): string {
  // If there's only 1 definition: don't include partsOfSpeech info
  const includePartsOfSpeech = glossary.definitionGroups.length !== 1;
  const totalDefinitions = glossary.definitionGroups.reduce((currentCount, group) => currentCount + group.definitions.length, 0);
  let retVal = '';

  // TODO: Do I want to wrap in an HTML list, or just number them arbitrarily???
  // Used for counting all 
  let defNumber = 1;
  glossary.definitionGroups.forEach((group) => {
    const tags = definitionGroupTags(group, includePartsOfSpeech);

    group.definitions.forEach((def) => {
      retVal += `${defNumber}. ${definitionToString(def, tags)}${defNumber === totalDefinitions ? '' : '<br/>'}`;
      defNumber++;
    });
  });

  return retVal;
}

function definitionGroupTags(group: ParsedDefinitionGroup, includePartsOfSpeech: boolean): string[] {
  const modifiers: string[] = [];
  if (group.groupTags) modifiers.push(...group.groupTags);
  if (includePartsOfSpeech) modifiers.push(...group.partsOfSpeech);
  return modifiers;
}

function definitionToString(definition: ParsedDefinition, groupTags: string[]) {
  let tags: string[] = [];
  if (definition.definitionTags && definition.definitionTags?.length !== 0) {
    tags.push(...definition.definitionTags);
  }

  tags.push(...groupTags);

  const modifierStr = tags.length !== 0 ? ` [${tags.join(',')}]` : '';
  return `${definition.definition}${modifierStr}`;
}
