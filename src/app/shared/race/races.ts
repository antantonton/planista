import { Attribute, WeaponSkill } from "../attributes/attributes"

export enum Race {
    ELF = 'ELF',
    HUMAN = 'HUMAN',
    GOBLIN = 'GOBLIN',
    ORC = 'ORC',
    DWARF = 'DWARF',
    TROLL = 'TROLL',
}

export const RACE_BONUSES: {[race in Race]: {[attribute in Attribute | WeaponSkill]: number}} = {
    [Race.ELF]: {
        [Attribute.STAMINA]: 0.9,
        [Attribute.STRENGTH]: 0.9,
        [Attribute.ENDURANCE]: 1.5,
        [Attribute.DODGE]: 1.55,
        [Attribute.INITIATIVE]: 1.4,
        [WeaponSkill.SPEAR]: 1.3,
        [WeaponSkill.MACE]: 0.9,
        [WeaponSkill.SWORD]: 1.15,
        [WeaponSkill.AXE]: 1,
        [WeaponSkill.CHAIN]: 0.9,
        [WeaponSkill.STAVE]: 1.2,
        [WeaponSkill.FIST_WEAPON]: 0.7,
        [Attribute.SHIELD]: 1.25,
    },

    [Race.HUMAN]: {
        [Attribute.STAMINA]: 1.1,
        [Attribute.STRENGTH]: 1.1,
        [Attribute.ENDURANCE]: 1.1,
        [Attribute.DODGE]: 1.1,
        [Attribute.INITIATIVE]: 1.1,
        [WeaponSkill.SPEAR]: 1.15,
        [WeaponSkill.MACE]: 1.1,
        [WeaponSkill.SWORD]: 1.2,
        [WeaponSkill.AXE]: 1.2,
        [WeaponSkill.CHAIN]: 1.1,
        [WeaponSkill.STAVE]: 1.1,
        [WeaponSkill.FIST_WEAPON]: 1.1,
        [Attribute.SHIELD]: 1.15,
    },

    [Race.GOBLIN]: {
        [Attribute.STAMINA]: 0.85,
        [Attribute.STRENGTH]: 1.2,
        [Attribute.ENDURANCE]: 1,
        [Attribute.DODGE]: 1.3,
        [Attribute.INITIATIVE]: 1.1,
        [WeaponSkill.SPEAR]: 1.3,
        [WeaponSkill.MACE]: 1.3,
        [WeaponSkill.SWORD]: 0.8,
        [WeaponSkill.AXE]: 0.9,
        [WeaponSkill.CHAIN]: 1.1,
        [WeaponSkill.STAVE]: 0.9,
        [WeaponSkill.FIST_WEAPON]: 1.2,
        [Attribute.SHIELD]: 0.95,
    },

    [Race.ORC]: {
        [Attribute.STAMINA]: 1.2,
        [Attribute.STRENGTH]: 1.3,
        [Attribute.ENDURANCE]: 0.9,
        [Attribute.DODGE]: 0.7,
        [Attribute.INITIATIVE]: 0.95,
        [WeaponSkill.SPEAR]: 1.05,
        [WeaponSkill.MACE]: 1.1,
        [WeaponSkill.SWORD]: 1,
        [WeaponSkill.AXE]: 1.1,
        [WeaponSkill.CHAIN]: 1.1,
        [WeaponSkill.STAVE]: 0.75,
        [WeaponSkill.FIST_WEAPON]: 0.9,
        [Attribute.SHIELD]: 0.9,
    },

    [Race.DWARF]: {
        [Attribute.STAMINA]: 1.3,
        [Attribute.STRENGTH]: 1.2,
        [Attribute.ENDURANCE]: 0.8,
        [Attribute.DODGE]: 0.6,
        [Attribute.INITIATIVE]: 0.8,
        [WeaponSkill.SPEAR]: 0.7,
        [WeaponSkill.MACE]: 1.2,
        [WeaponSkill.SWORD]: 1,
        [WeaponSkill.AXE]: 1.2,
        [WeaponSkill.CHAIN]: 1,
        [WeaponSkill.STAVE]: 0.7,
        [WeaponSkill.FIST_WEAPON]: 0.85,
        [Attribute.SHIELD]: 1.2,
    },

    [Race.TROLL]: {
        [Attribute.STAMINA]: 1.55,
        [Attribute.STRENGTH]: 1.45,
        [Attribute.ENDURANCE]: 0.6,
        [Attribute.DODGE]: 0.4,
        [Attribute.INITIATIVE]: 0.6,
        [WeaponSkill.SPEAR]: 0.75,
        [WeaponSkill.MACE]: 0.85,
        [WeaponSkill.SWORD]: 0.7,
        [WeaponSkill.AXE]: 0.8,
        [WeaponSkill.CHAIN]: 0.85,
        [WeaponSkill.STAVE]: 0.65,
        [WeaponSkill.FIST_WEAPON]: 0.7,
        [Attribute.SHIELD]: 0.8,
    },
}