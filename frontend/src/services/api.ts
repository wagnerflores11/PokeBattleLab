import axios from "axios";
import type {
  Pokemon,
  PokemonComparison,
  CounterRecommendation,
  TypeRelations,
  FavoriteEntry,
} from "../types/pokemon";

const api = axios.create({ baseURL: "/api/v1" });

export async function getPokemon(identifier: string): Promise<Pokemon> {
  const { data } = await api.get<Pokemon>(`/pokemon/${identifier}`);
  return data;
}

export async function searchPokemon(query: string, limit = 20): Promise<Pokemon[]> {
  const { data } = await api.get<Pokemon[]>("/pokemon", { params: { q: query, limit } });
  return data;
}

export async function getTypeRelations(typeName: string): Promise<TypeRelations> {
  const { data } = await api.get<TypeRelations>(`/types/${typeName}`);
  return data;
}

export async function getAllTypes(): Promise<string[]> {
  const { data } = await api.get<string[]>("/types");
  return data;
}

export async function comparePokemon(a: string, b: string): Promise<PokemonComparison> {
  const { data } = await api.get<PokemonComparison>("/compare", {
    params: { pokemon_a: a, pokemon_b: b },
  });
  return data;
}

export async function getCounters(name: string, limit = 5): Promise<CounterRecommendation> {
  const { data } = await api.get<CounterRecommendation>(`/counters/${name}`, {
    params: { limit },
  });
  return data;
}

export async function getFavorites(): Promise<FavoriteEntry[]> {
  const { data } = await api.get<FavoriteEntry[]>("/favorites");
  return data;
}

export async function addFavorite(pokemonId: number, pokemonName: string): Promise<FavoriteEntry> {
  const { data } = await api.post<FavoriteEntry>("/favorites", {
    pokemon_id: pokemonId,
    pokemon_name: pokemonName,
  });
  return data;
}

export async function removeFavorite(pokemonId: number): Promise<void> {
  await api.delete(`/favorites/${pokemonId}`);
}

export async function checkFavorite(pokemonId: number): Promise<boolean> {
  const { data } = await api.get<{ is_favorite: boolean }>(`/favorites/${pokemonId}/check`);
  return data.is_favorite;
}
