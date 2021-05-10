export default function traversePath(iPos, fPos) {
  const path = [];
  if (iPos[0] === fPos[0] && iPos[1] !== fPos[1]) {
    for (let i = iPos[1]; i <= fPos[1]; i++) {
      path.push([iPos[0], i]);
    }
  } else if (iPos[1] === fPos[1] && iPos[0] !== fPos[0]) {
    for (let i = iPos[0]; i <= fPos[0]; i++) {
      path.push([i, iPos[1]]);
    }
  }
  return path;
}
