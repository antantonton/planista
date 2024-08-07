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
  bonuses: ItemBonus[]
  is_weapon: boolean
  is_two_handed: boolean
  is_shield: boolean
  can_dual_wield: boolean
  is_ranged: boolean
  base_damage_min: number
  base_damage_max: number
  damage_roof: number
  durability: number
  weight: number
  actions: number
  required_level: number
  type_name: string
}

export type Consumable = {
  id: number
  name: string
  for_live_battle: boolean
  bonuses: ItemBonus[]
}

export type ItemBonus = {
  type: string
  additive: number
  multiplier: number
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

export type Enchant = {
  name: string
}
