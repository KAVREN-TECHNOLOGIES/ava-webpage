"""Fetch CC0 anatomical data used to author the AVA combo mesh."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import urllib.request

ROOT = Path(__file__).resolve().parent / "source"
ROOT.mkdir(parents=True, exist_ok=True)
REMOTE = "https://raw.githubusercontent.com/makehumancommunity/makehuman/master/makehuman/data/targets/"
TARGETS = [
    "macrodetails/caucasian-female-young.target",
    "macrodetails/african-female-young.target",
    "macrodetails/universal-female-young-averagemuscle-averageweight.target",
    "macrodetails/universal-female-young-averagemuscle-maxweight.target",
    "breast/female-young-averagemuscle-averageweight-averagecup-minfirmness.target",
    "breast/female-young-averagemuscle-averageweight-averagecup-maxfirmness.target",
    "breast/female-young-averagemuscle-averageweight-maxcup-maxfirmness.target",
    "breast/female-young-averagemuscle-averageweight-mincup-maxfirmness.target",
    "breast/breast-trans-up.target",
    "breast/breast-trans-down.target",
    "buttocks/buttocks-volume-incr.target",
    "stomach/stomach-tone-incr.target",
    "stomach/stomach-tone-decr.target",
    "hip/hip-scale-horiz-incr.target",
]

def download(name):
    target = ROOT / name
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.exists():
        urllib.request.urlretrieve(REMOTE + name, target)
    return name

if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=6) as pool:
        downloaded = list(pool.map(download, TARGETS))
    vertices, groups, current = [], {}, ""
    for line in (ROOT / "base.obj").read_text().splitlines():
        fields = line.split()
        if not fields:
            continue
        if fields[0] == "v":
            vertices.append(tuple(map(float, fields[1:4])))
        elif fields[0] == "g":
            current = fields[1]
            groups[current] = set()
        elif fields[0] == "f":
            groups.setdefault(current, set()).update(int(item.split("/")[0]) - 1 for item in fields[1:])
    names = [name for name in groups if any(part in name for part in ("pelvis", "spine", "shoulder", "knee", "elbow", "neck"))]
    joints = {name: [round(sum(vertices[index][axis] for index in groups[name]) / len(groups[name]), 3) for axis in range(3)] for name in names if groups[name]}
    print(json.dumps({"targets": len(downloaded), "body_vertices": len(groups["body"]), "landmarks": joints}, indent=2))
