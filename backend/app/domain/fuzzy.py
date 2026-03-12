def levenshtein(a: str, b: str) -> int:
    if len(a) < len(b):
        return levenshtein(b, a)
    if len(b) == 0:
        return len(a)
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a):
        curr = [i + 1]
        for j, cb in enumerate(b):
            cost = 0 if ca == cb else 1
            curr.append(min(curr[j] + 1, prev[j + 1] + 1, prev[j] + cost))
        prev = curr
    return prev[-1]


def find_closest(query: str, candidates: list[str], max_distance: int = 4) -> str | None:
    query = query.lower().strip()
    best_name = None
    best_score = max_distance + 1

    for name in candidates:
        dist = levenshtein(query, name)

        # Penalize large length differences to avoid "mewtoo" → "mew"
        len_diff = abs(len(query) - len(name))
        adjusted = dist + len_diff * 0.5

        if adjusted < best_score:
            best_score = adjusted
            best_name = name

    # Only return if within reasonable distance
    return best_name if best_score <= max_distance else None
