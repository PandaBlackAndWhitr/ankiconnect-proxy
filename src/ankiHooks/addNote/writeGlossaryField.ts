import type { ParsedDefinitionGroup, ParsedGlossary } from './types';

export function writeGlossaryField(glossary: ParsedGlossary): string {
  // If there's only 1 definition: don't include partsOfSpeech info
  const includePartsOfSpeech = glossary.definitionGroups.length !== 1;
  const totalDefinitions = glossary.definitionGroups.reduce((currentCount, group) => currentCount + group.definitions.length, 0);
  let retVal = '';

  // TODO: Do I want to wrap in an HTML list, or just number them arbitrarily???
  // Used for counting all 
  let defNumber = 1;
  glossary.definitionGroups.forEach((group) => {
    const normalizedDefinitions = definitionGroupToStrings(group, includePartsOfSpeech);
    for(let i=0; i<normalizedDefinitions.length; i++) {
      retVal += `${defNumber}. ${normalizedDefinitions[i]}${defNumber === totalDefinitions ? '' : '<br/>'}`;
      defNumber++;
    }
  });

  return retVal;
}

function definitionGroupToStrings(group: ParsedDefinitionGroup, includePartsOfSpeech: boolean): string[] {
  const modifiers: string[] = [];
  if (group.groupTags) modifiers.push(...group.groupTags);
  if (includePartsOfSpeech) modifiers.push(...group.partsOfSpeech);

  const modifierStr = modifiers.length !== 0 ? ` [${modifiers.join(',')}]`
    : '';
  
  // https://stackoverflow.com/a/60372878
  return group.definitions.map((val) => (`${val.definition}${modifierStr}`));
}