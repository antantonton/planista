export enum AgeRace {
  HUMAN = 'HUMAN',
  ELF = 'ELF',
  DWARF = 'DWARF',
  ORC = 'ORC',
  TROLL = 'TROLL',
  GOBLIN = 'GOBLIN',
  //   UNDEAD = 'UNDEAD',
  SALAMANTH = 'SALAMANTH',
}

export enum Age {
  //   YOUNG = 'YOUNG',
  ADULT = 'ADULT',
  MIDDLE_AGED = 'MIDDLE_AGED',
  OLD = 'OLD',
  ANCIENT = 'ANCIENT',
}

export const RACE_AGE_LIMIT: { [race in AgeRace]: { [age in Age]: number | null } } = {
  [AgeRace.HUMAN]: {
    // [Age.YOUNG]: 0,
    [Age.ADULT]: 16,
    [Age.MIDDLE_AGED]: 29,
    [Age.OLD]: 39,
    [Age.ANCIENT]: 50,
  },
  [AgeRace.ELF]: {
    // [Age.YOUNG]: 0,
    [Age.ADULT]: 18,
    [Age.MIDDLE_AGED]: 35,
    [Age.OLD]: 50,
    [Age.ANCIENT]: null,
  },
  [AgeRace.DWARF]: {
    // [Age.YOUNG]: 0,
    [Age.ADULT]: 16,
    [Age.MIDDLE_AGED]: 29,
    [Age.OLD]: 39,
    [Age.ANCIENT]: 50,
  },
  [AgeRace.ORC]: {
    // [Age.YOUNG]: 0,
    [Age.ADULT]: 15,
    [Age.MIDDLE_AGED]: 28,
    [Age.OLD]: 39,
    [Age.ANCIENT]: 47,
  },
  [AgeRace.TROLL]: {
    // [Age.YOUNG]: 0,
    [Age.ADULT]: 15,
    [Age.MIDDLE_AGED]: 28,
    [Age.OLD]: 39,
    [Age.ANCIENT]: 47,
  },
  [AgeRace.GOBLIN]: {
    // [Age.YOUNG]: 0,
    [Age.ADULT]: 14,
    [Age.MIDDLE_AGED]: 26,
    [Age.OLD]: 39,
    [Age.ANCIENT]: 47,
  },
  //   [AgeRace.UNDEAD]: {
  //     [Age.YOUNG]: 0,
  //     [Age.ADULT]: null,
  //     [Age.MIDDLE_AGED]: null,
  //     [Age.OLD]: null,
  //     [Age.ANCIENT]: null,
  //   },
  [AgeRace.SALAMANTH]: {
    // [Age.YOUNG]: 0,
    [Age.ADULT]: 14,
    [Age.MIDDLE_AGED]: 26,
    [Age.OLD]: 39,
    [Age.ANCIENT]: 47,
  },
}
