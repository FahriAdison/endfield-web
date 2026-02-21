#!/usr/bin/env python3
"""
Sync gear stats/effects from arknightsendfield.gg embedded gear dataset.

This updates:
1) data/content.json -> gearCatalog (per-item stats/effects/description/level)
2) data/content.json -> characters[].profile gearRecommendations + gearProgression slots
   using canonical gearCatalog values by normalized gear name.
"""

from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List

import requests

ROOT = Path(__file__).resolve().parents[1]
CONTENT_JSON = ROOT / "data" / "content.json"
SOURCE_PAGE = "https://arknightsendfield.gg/armor/frontiers-armor/"

PAIR_RE = re.compile(r"'([^']+)'\s*:\s*'((?:\\.|[^'])*)'")


def normalize_token(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", str(value or "").lower())


def decode_value(raw: str) -> str:
    text = str(raw or "")
    text = text.replace("\\'", "'").replace('\\"', '"').replace("\\/", "/")
    text = text.replace("\\n", " ").replace("\\r", " ").replace("\\t", " ")
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def clean_stat_name(name: str) -> str:
    text = decode_value(name)
    if not text:
        return ""
    text = text.strip("[]{}\"'")
    return text.strip()


def clean_stat_value(value: str) -> str:
    text = decode_value(value)
    if not text:
        return ""
    text = text.strip("[]{}\"'")
    text = text.replace("％", "%")
    return text.strip()


def format_stat_value(value: str) -> str:
    text = clean_stat_value(value)
    if not text:
        return ""
    compact = text.replace(",", "")
    if re.fullmatch(r"-?\d+(?:\.\d+)?%?", compact):
        if compact.startswith("-") or compact.startswith("+"):
            return compact
        return f"+{compact}"
    return text


def fetch_source_pairs(url: str) -> Dict[str, str]:
    response = requests.get(url, timeout=45)
    response.raise_for_status()
    pairs = PAIR_RE.findall(response.text)
    if not pairs:
        raise RuntimeError("No key/value pairs found in source page.")
    return {key: value for key, value in pairs}


def build_source_records(pairs: Dict[str, str]) -> Dict[str, Dict[str, Any]]:
    prefixes = sorted({key[:-5] for key in pairs if key.endswith("_desc")})
    records: Dict[str, Dict[str, Any]] = {}
    for prefix in prefixes:
        attrs: List[Dict[str, str]] = []
        for idx in range(1, 11):
            n = clean_stat_name(pairs.get(f"{prefix}_attribute{idx}", ""))
            v = format_stat_value(pairs.get(f"{prefix}_attribute{idx}value", ""))
            if not n and not v:
                continue
            attrs.append({"name": n, "value": v})
        level = decode_value(pairs.get(f"{prefix}_level", ""))
        defense = format_stat_value(pairs.get(f"{prefix}_def", ""))
        effect = decode_value(pairs.get(f"{prefix}_effect", ""))
        effect_desc = decode_value(pairs.get(f"{prefix}_effectdesc", ""))
        desc = decode_value(pairs.get(f"{prefix}_desc", ""))
        records[prefix] = {
            "prefix": prefix,
            "level": level,
            "def": defense,
            "effect": effect,
            "effectdesc": effect_desc,
            "desc": desc,
            "attrs": attrs,
        }
    return records


def merge_stats(source_attrs: List[Dict[str, str]], old_stats: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    result: List[Dict[str, str]] = []
    old_stats = old_stats if isinstance(old_stats, list) else []
    for idx, stat in enumerate(source_attrs):
        name = clean_stat_name(stat.get("name", ""))
        value = clean_stat_value(stat.get("value", ""))
        if not name:
            fallback_name = clean_stat_name((old_stats[idx] or {}).get("name", "")) if idx < len(old_stats) else ""
            name = fallback_name or f"Stat {idx + 1}"
        if not value:
            fallback_value = clean_stat_value((old_stats[idx] or {}).get("value", "")) if idx < len(old_stats) else ""
            value = fallback_value
        value = format_stat_value(value)
        if not value:
            continue
        result.append({"name": name, "value": value})
    return result


def canonical_effect_name(effect_name: str) -> str:
    raw = decode_value(effect_name)
    if not raw:
        return "-"
    if raw.lower().startswith("no 3-pc set effect"):
        return "-"
    return raw


def canonical_effect_desc(effect_desc: str) -> str:
    raw = decode_value(effect_desc)
    return raw if raw else "-"


def canonical_description(description: str, fallback: str) -> str:
    raw = decode_value(description)
    if raw:
        return raw
    return str(fallback or "-")


def format_display_name_from_prefix(prefix: str) -> str:
    parts = str(prefix or "").split("_")
    if not parts:
        return ""
    out: List[str] = []
    for part in parts:
        if not part:
            continue
        if part in {"t1", "t2", "t3", "t4"}:
            out.append(part.upper())
            continue
        if part == "\u00e6thertech":
            out.append("\u00c6thertech")
            continue
        if part in {"aic", "msgr", "lynx", "mi", "o2"}:
            out.append(part.upper())
            continue
        out.append(part.capitalize())
    return " ".join(out).strip()


def has_broken_encoding(text: str) -> bool:
    s = str(text or "")
    return any(token in s for token in ("Ã", "â€", "脙", "�"))


def update_item_with_source(item: Dict[str, Any], source: Dict[str, Any]) -> None:
    old_stats = item.get("stats", [])
    stats = merge_stats(source.get("attrs", []), old_stats)
    if not stats and isinstance(old_stats, list):
        stats = [
            {
                "name": clean_stat_name(stat.get("name", f"Stat {idx + 1}")),
                "value": format_stat_value(stat.get("value", "")),
            }
            for idx, stat in enumerate(old_stats)
            if format_stat_value(stat.get("value", ""))
        ]

    item["usageLevel"] = str(source.get("level") or item.get("usageLevel") or "").strip() or item.get("usageLevel", "")
    item["effectName"] = canonical_effect_name(source.get("effect", ""))
    item["effectDescription"] = canonical_effect_desc(source.get("effectdesc", ""))
    item["description"] = canonical_description(source.get("desc", ""), item.get("description", "-"))
    item["stats"] = stats
    if source.get("def"):
        item["baseDef"] = format_stat_value(source["def"])

    prefix = str(source.get("prefix", ""))
    if has_broken_encoding(item.get("name", "")) and prefix.startswith("\u00e6thertech_"):
        fixed = format_display_name_from_prefix(prefix)
        if fixed:
            item["name"] = fixed


def patch_profile_gear_entries(entry: Dict[str, Any], canonical: Dict[str, Any]) -> None:
    if has_broken_encoding(entry.get("name", "")) and canonical.get("name"):
        entry["name"] = canonical["name"]

    for key in ("icon", "source", "type", "usageLevel", "effectName", "effectDescription", "description", "stats"):
        if key in canonical:
            entry[key] = canonical[key]

    if "baseDef" in canonical:
        entry["baseDef"] = canonical["baseDef"]


def main() -> int:
    if not CONTENT_JSON.exists():
        print(f"Missing file: {CONTENT_JSON}", file=sys.stderr)
        return 1

    content = json.loads(CONTENT_JSON.read_text(encoding="utf-8-sig"))
    gear_catalog = content.get("gearCatalog", [])
    if not isinstance(gear_catalog, list) or not gear_catalog:
        print("gearCatalog missing/empty.", file=sys.stderr)
        return 1

    print(f"Fetching source dataset: {SOURCE_PAGE}")
    pairs = fetch_source_pairs(SOURCE_PAGE)
    source_records = build_source_records(pairs)
    token_to_prefix = {normalize_token(prefix): prefix for prefix in source_records}

    synced = 0
    for item in gear_catalog:
        name = str(item.get("name", ""))
        token = normalize_token(name)
        prefix = token_to_prefix.get(token)
        if not prefix:
            continue
        update_item_with_source(item, source_records[prefix])
        synced += 1

    print(f"gearCatalog synced: {synced}/{len(gear_catalog)}")

    canonical_by_token = {normalize_token(str(item.get("name", ""))): item for item in gear_catalog}
    chars = content.get("characters", [])
    patched_rec = 0
    patched_prog = 0

    for char in chars if isinstance(chars, list) else []:
        profile = char.get("profile")
        if not isinstance(profile, dict):
            continue

        recs = profile.get("gearRecommendations")
        if isinstance(recs, list):
            for rec in recs:
                token = normalize_token(rec.get("name", ""))
                canonical = canonical_by_token.get(token)
                if not canonical:
                    continue
                patch_profile_gear_entries(rec, canonical)
                patched_rec += 1

        progression = profile.get("gearProgression")
        if isinstance(progression, dict):
            for level_data in progression.values():
                if not isinstance(level_data, dict):
                    continue
                slots = level_data.get("slots")
                if not isinstance(slots, dict):
                    continue
                for slot_entry in slots.values():
                    if not isinstance(slot_entry, dict):
                        continue
                    token = normalize_token(slot_entry.get("name", ""))
                    canonical = canonical_by_token.get(token)
                    if not canonical:
                        continue
                    patch_profile_gear_entries(slot_entry, canonical)
                    patched_prog += 1

    print(f"profile gearRecommendations patched: {patched_rec}")
    print(f"profile gearProgression slots patched: {patched_prog}")

    CONTENT_JSON.write_text(
        json.dumps(content, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8-sig",
    )
    print(f"Updated: {CONTENT_JSON}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
