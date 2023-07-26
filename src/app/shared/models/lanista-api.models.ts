export const STARTING_POINTS = 150
export const POINTS_PER_LEVEL = 20

export enum AttributeType {
  STAT = 'STAT',
  WEAPON_SKILL = 'WEAPON_SKILL',
}

export type ArmorSlot = {
  name: string
  type: number
}

export type Equipment = {
  id: number
  type: number
  name: string
  // bonuses: EquipmentBonuses
}

export type EquipmentBonuses = {
  stats: EquipmentBonus[]
  weapon_skills: EquipmentBonus[]
}

export type EquipmentBonus = {
  type: number
  value: number
}

export type Config = {
  races: Race[]
  stats: Stat[]
  weapon_skills: WeaponSkill[]
  grouped_stats: GroupedStats
  blockable_armor_types: ArmorTypes
  trinket_armor_types: ArmorTypes
}

export type GroupedStats = {
  stamina: Stat[]
  agility: Stat[]
  wisdom: Stat[]
}

export type Race = {
  name: string
  type: number
  bonuses: RaceBonuses
}

export type RaceBonuses = {
  stats: RaceBonus[]
  weapon_skills: RaceBonus[]
}

export type RaceBonus = {
  type: number
  value: number
}

export type Stat = {
  name: string
  type: number
  visible: boolean
}

export type WeaponSkill = {
  name: string
  type: number
  visible: boolean
}

export type ArmorTypes = {
  [name: string]: number
}
