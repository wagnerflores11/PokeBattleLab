export interface PokemonType {
  name: string;
  url?: string;
}

export interface PokemonStat {
  name: string;
  base_value: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  stats: PokemonStat[];
  height: number;
  weight: number;
  sprite_url: string | null;
}

export interface TypeRelations {
  name: string;
  double_damage_to: string[];
  half_damage_to: string[];
  no_damage_to: string[];
  double_damage_from: string[];
  half_damage_from: string[];
  no_damage_from: string[];
}

export interface TypeEffectiveness {
  attacking_type: string;
  defending_type: string;
  multiplier: number;
}

export interface PokemonComparison {
  pokemon_a: Pokemon;
  pokemon_b: Pokemon;
  type_advantages: TypeEffectiveness[];
  stat_differences: Record<string, number>;
}

export interface CounterRecommendation {
  target: Pokemon;
  counters: Pokemon[];
  reasoning: string[];
}

export interface FavoriteEntry {
  pokemon_id: number;
  pokemon_name: string;
  added_at: string;
}
