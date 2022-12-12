export type WeaponType = {
  string: number
}

export interface Weapon {
  id: number
  name: string
  type: number
  type_name: string
  description: string
  base_damage_min: number
  base_damage_max: number
  crit_damage_min: number
  crit_damage_max: number
  crit_damage_min_info: number
  crit_damage_max_info: number
  crit_damage: string
  crit_damage_info: string
  durability: number
  damage_roof: number
  absorption: number
  weight: number
  is_two_handed: boolean
  can_dual_wield: boolean
  required_level: number
  crit_rate: number
  min_crit_rate: number
  max_crit_rate: number
  is_shield: boolean
  is_ranged: boolean
  is_weapon: boolean
  sell_value: number
  default_price: number
  requires_legend: boolean
  soulbound: boolean
  asset: Asset
  requirements: Requirement[]
  bonuses: Bonus[]
  actions: number
  defensive_actions: number
}

export interface Asset {
  id: number
  url: string
  description: string
}

export interface Requirement {
  id: number
  requirement_text: string
  requirement_value: number
  requirement_type: number
  requirementable: string
  requirementable_id: number
  show_current_value: boolean
}

export interface Bonus {
  id: number
  bonusable_name: string
  bonus_value_display: string
  bonus_text: string
}
