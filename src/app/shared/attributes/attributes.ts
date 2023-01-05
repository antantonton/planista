export const STARTING_POINTS: number = 150

export const POINT_PER_LEVEL: number = 20

export enum Attribute {
  STAMINA = 'STAMINA',
  STRENGTH = 'STRENGTH',
  ENDURANCE = 'ENDURANCE',
  SHIELD = 'SHIELD',
  DODGE = 'DODGE',
  INITIATIVE = 'INITIATIVE',
}

export enum WeaponSkill {
  SPEAR = 'SPEAR',
  MACE = 'MACE',
  SWORD = 'SWORD',
  AXE = 'AXE',
  CHAIN = 'CHAIN',
  STAVE = 'STAVE',
}

export const ATTRIBUTE_LABELS: { [attribute in Attribute | WeaponSkill]: string } = {
  [Attribute.STAMINA]: 'Base Health',
  [Attribute.STRENGTH]: 'Strength',
  [Attribute.ENDURANCE]: 'Endurance',
  [Attribute.DODGE]: 'Dodge',
  [Attribute.INITIATIVE]: 'Initiative',
  [WeaponSkill.SPEAR]: 'Spears',
  [WeaponSkill.MACE]: 'Maces',
  [WeaponSkill.SWORD]: 'Swords',
  [WeaponSkill.AXE]: 'Axes',
  [WeaponSkill.CHAIN]: 'Chains',
  [WeaponSkill.STAVE]: 'Staves',
  [Attribute.SHIELD]: 'Shields',
}
