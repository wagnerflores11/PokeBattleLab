import time

from app.adapters.cache import InMemoryCache


def test_set_and_get():
    cache = InMemoryCache(ttl_seconds=60)
    cache.set("key1", "value1")
    assert cache.get("key1") == "value1"


def test_get_missing_key():
    cache = InMemoryCache(ttl_seconds=60)
    assert cache.get("missing") is None


def test_delete():
    cache = InMemoryCache(ttl_seconds=60)
    cache.set("key1", "value1")
    cache.delete("key1")
    assert cache.get("key1") is None


def test_clear():
    cache = InMemoryCache(ttl_seconds=60)
    cache.set("a", 1)
    cache.set("b", 2)
    cache.clear()
    assert cache.get("a") is None
    assert cache.get("b") is None


def test_ttl_expiration():
    cache = InMemoryCache(ttl_seconds=0)
    cache.set("key1", "value1")
    # TTL is 0 seconds, should expire immediately
    time.sleep(0.01)
    assert cache.get("key1") is None
