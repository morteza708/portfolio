import os

from django.core.cache import cache

CACHE_TTL = int(os.environ.get("CACHE_TTL", "3600"))
CACHE_PREFIX = "api:v1"


def api_cache_key(*parts: str) -> str:
    return f"{CACHE_PREFIX}:{':'.join(parts)}"


def get_cached(key: str):
    return cache.get(key)


def set_cached(key: str, value, ttl: int = CACHE_TTL) -> None:
    cache.set(key, value, ttl)


def delete_cached(*keys: str) -> None:
    cache.delete_many(keys)


def _list_version_key(namespace: str, language: str) -> str:
    return api_cache_key(namespace, language, "version")


def get_list_version(namespace: str, language: str) -> int:
    return cache.get(_list_version_key(namespace, language), 0)


def bump_list_version(namespace: str, language: str) -> None:
    key = _list_version_key(namespace, language)
    cache.set(key, cache.get(key, 0) + 1, None)


def list_cache_key(namespace: str, language: str, page: str = "1") -> str:
    version = get_list_version(namespace, language)
    return api_cache_key(namespace, language, f"v{version}", "page", page)


def invalidate_profile(language: str) -> None:
    delete_cached(api_cache_key("profile", language))


def invalidate_skills(language: str) -> None:
    delete_cached(api_cache_key("skills", language))
    bump_list_version("skills", language)


def invalidate_experiences(language: str) -> None:
    bump_list_version("experiences", language)


def invalidate_education(language: str) -> None:
    bump_list_version("education", language)


def invalidate_certifications(language: str) -> None:
    bump_list_version("certifications", language)


def invalidate_projects(language: str, slug: str | None = None) -> None:
    bump_list_version("projects", language)
    if slug:
        delete_cached(api_cache_key("project", language, slug))


def invalidate_articles(language: str, slug: str | None = None) -> None:
    bump_list_version("articles", language)
    if slug:
        delete_cached(api_cache_key("article", language, slug))
