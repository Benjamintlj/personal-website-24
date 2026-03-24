// metaball-logic.js — plain JS, no TypeScript
// Adapted from script.js: DOM queries removed, color changed to #4ade80, cleanup returned.

export function initMetaball(stage, canvas) {
  const ctx = canvas.getContext('2d', { alpha: true })

  const GRID_WIDTH = 15;
  const GRID_HEIGHT = 11;
  const ROOT_X = Math.ceil(GRID_WIDTH / 2);
  const ROOT_Y = 6;
  const MIN_X = 1;
  const MAX_X = GRID_WIDTH;

  const ACTIVE_GRID_SPAN = 0.58;
  const BALL_RADIUS_RATIO = 0.44;

  const MUTATION_INTERVAL_MS = 280;
  const NODE_GROW_MS = 1100;
  const NODE_SHRINK_MS = 800;
  const MOMENTUM_WEIGHTS = {
    PRIMARY_HORIZONTAL: 1,
    PRIMARY_DIAGONAL: 0.4,
    VERTICAL: 0.3,
    SECONDARY_DIAGONAL: 0.00001,
    SECONDARY_HORIZONTAL: 0.00001,
  };
  const SECONDARY_MOVE_CHANCE = Math.min(
    1,
    Math.max(0, Math.max(MOMENTUM_WEIGHTS.SECONDARY_DIAGONAL, MOMENTUM_WEIGHTS.SECONDARY_HORIZONTAL))
  );

  const ROOT_ID = 0;

  let dpr = 1;
  let rafId;
  let canvasWidth = 0;
  let canvasHeight = 0;

  let gridStepX = 0;
  let gridStepY = 0;
  let gridOffsetX = 0;
  let gridOffsetY = 0;
  let ballRadius = 10;

  let nextNodeId = 1;
  let lastMutationAt = performance.now();

  const nodes = new Map();
  const occupied = new Map();

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
  }

  function keyFor(x, y) {
    return `${x}:${y}`;
  }

  function resize() {
    const bounds = stage.getBoundingClientRect();

    dpr = Math.min(1.35, Math.max(1, window.devicePixelRatio || 1));
    canvasWidth = Math.max(1, Math.floor(bounds.width * dpr));
    canvasHeight = Math.max(1, Math.floor(bounds.height * dpr));

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const maxStepX = (canvasWidth * ACTIVE_GRID_SPAN) / (GRID_WIDTH - 1);
    const maxStepY = (canvasHeight * ACTIVE_GRID_SPAN) / (GRID_HEIGHT - 1);
    const unifiedStep = Math.min(maxStepX, maxStepY);

    const activeWidth = unifiedStep * (GRID_WIDTH - 1);
    const activeHeight = unifiedStep * (GRID_HEIGHT - 1);
    gridStepX = unifiedStep;
    gridStepY = unifiedStep;
    gridOffsetX = (canvasWidth - activeWidth) * 0.5;
    gridOffsetY = (canvasHeight - activeHeight) * 0.5;

    const stepBase = Math.min(gridStepX, gridStepY);
    ballRadius = clamp(stepBase * BALL_RADIUS_RATIO, 7 * dpr, 34 * dpr);
  }

  function gridToCanvas(node) {
    return {
      x: gridOffsetX + (node.x - 1) * gridStepX,
      y: gridOffsetY + (node.y - 1) * gridStepY,
    };
  }

  function pointOnCircle(cx, cy, radius, angle) {
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    };
  }

  function pointFrom(origin, angle, distance) {
    return {
      x: origin.x + Math.cos(angle) * distance,
      y: origin.y + Math.sin(angle) * distance,
    };
  }

  function createNode(parentId, x, y, bornAt) {
    const id = nextNodeId;
    nextNodeId += 1;
    const parent = nodes.get(parentId) || null;
    const inheritedSide = parent ? parent.bornSide : "center";
    const bornSide = x < ROOT_X ? "left" : x > ROOT_X ? "right" : inheritedSide;

    const node = {
      id,
      parentId,
      x,
      y,
      bornSide,
      bornAt,
      deathAt: null,
      children: new Set(),
    };

    nodes.set(id, node);
    occupied.set(keyFor(x, y), id);

    if (parent) {
      parent.children.add(id);
    }

    return node;
  }

  function getNodeGrowth(node, now) {
    if (node.deathAt !== null) {
      return 1 - clamp((now - node.deathAt) / NODE_SHRINK_MS, 0, 1);
    }

    return clamp((now - node.bornAt) / NODE_GROW_MS, 0, 1);
  }

  function initializeGraph(now) {
    nodes.clear();
    occupied.clear();
    nextNodeId = 1;

    const rootNode = {
      id: ROOT_ID,
      parentId: null,
      x: ROOT_X,
      y: ROOT_Y,
      bornSide: "center",
      bornAt: now - 6000,
      deathAt: null,
      children: new Set(),
    };

    nodes.set(ROOT_ID, rootNode);
    occupied.set(keyFor(rootNode.x, rootNode.y), ROOT_ID);

    tryAddBranch(now - 2800, {
      parentId: ROOT_ID,
      preferredDirection: -1,
      preferredSide: "left",
      outwardBias: 1,
      strictPreferred: true,
    });
    tryAddBranch(now - 2799, {
      parentId: ROOT_ID,
      preferredDirection: 1,
      preferredSide: "right",
      outwardBias: 1,
      strictPreferred: true,
    });

    for (let i = 0; i < 12; i += 1) {
      const seedTime = now - (12 - i) * 220;
      const preferredDirection = i % 2 === 0 ? -1 : 1;
      const preferredSide = preferredDirection === -1 ? "left" : "right";
      if (
        !tryAddBranch(seedTime, {
          preferredDirection,
          preferredSide,
          outwardBias: 0.96,
          strictPreferred: true,
        })
      ) {
        tryAddBranch(seedTime, { preferredDirection, preferredSide, outwardBias: 0.9 });
      }
    }

    lastMutationAt = now;
  }

  function shuffledPair(a, b) {
    return Math.random() < 0.5 ? [a, b] : [b, a];
  }

  function weightedMoveOrder(weightedMoves) {
    const pool = weightedMoves.filter((item) => item.weight > 0);
    const ordered = [];

    while (pool.length > 0) {
      let totalWeight = 0;
      for (const item of pool) {
        totalWeight += item.weight;
      }

      if (totalWeight <= 0) {
        break;
      }

      let roll = Math.random() * totalWeight;
      let pickIndex = pool.length - 1;

      for (let i = 0; i < pool.length; i += 1) {
        roll -= pool[i].weight;
        if (roll <= 0) {
          pickIndex = i;
          break;
        }
      }

      ordered.push(pool[pickIndex].move);
      pool.splice(pickIndex, 1);
    }

    return ordered;
  }

  function isAdjacentToParent(parent, x, y) {
    const dx = Math.abs(parent.x - x);
    const dy = Math.abs(parent.y - y);
    return dx <= 1 && dy <= 1 && (dx !== 0 || dy !== 0);
  }

  function hasInvalidNeighbor(x, y, parentId) {
    for (let nx = x - 1; nx <= x + 1; nx += 1) {
      for (let ny = y - 1; ny <= y + 1; ny += 1) {
        if (nx === x && ny === y) {
          continue;
        }

        const neighborId = occupied.get(keyFor(nx, ny));
        if (neighborId === undefined) {
          continue;
        }

        if (neighborId !== parentId) {
          return true;
        }
      }
    }

    return false;
  }

  function chooseParentCandidate(now, preferredDirection = null, preferredSide = null) {
    const candidates = [];

    for (const node of nodes.values()) {
      if (node.deathAt !== null) {
        continue;
      }
      if (preferredDirection === -1 && node.x <= MIN_X) {
        continue;
      }
      if (preferredDirection === 1 && node.x >= MAX_X) {
        continue;
      }
      if (now - node.bornAt < NODE_GROW_MS * 0.45) {
        continue;
      }
      candidates.push(node);
    }

    if (candidates.length === 0) {
      return null;
    }

    let totalWeight = 0;
    const weights = [];
    const maxRootDistance = Math.max(ROOT_X - MIN_X, MAX_X - ROOT_X);

    for (const node of candidates) {
      const outwardProgress = Math.abs(node.x - ROOT_X) / Math.max(1, maxRootDistance);
      const tipBias = 0.62 + outwardProgress * 0.9;
      const fanoutPenalty = 1 / (1 + node.children.size * 0.82);
      let sideWeight = 1;
      const nodeSide = node.x < ROOT_X ? "left" : node.x > ROOT_X ? "right" : "center";

      if (preferredSide === "left") {
        sideWeight *= nodeSide === "left" || nodeSide === "center" ? 1.9 : 0.42;
      } else if (preferredSide === "right") {
        sideWeight *= nodeSide === "right" || nodeSide === "center" ? 1.9 : 0.42;
      }

      if (preferredDirection === -1 && node.x > ROOT_X) {
        sideWeight *= 0.4;
      } else if (preferredDirection === 1 && node.x < ROOT_X) {
        sideWeight *= 0.4;
      }

      const weight = tipBias * fanoutPenalty * sideWeight;
      weights.push(weight);
      totalWeight += weight;
    }

    let roll = Math.random() * totalWeight;
    for (let i = 0; i < candidates.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) {
        return candidates[i];
      }
    }

    return candidates[candidates.length - 1];
  }

  function momentumMovesFor(parent, options = {}) {
    const preferredDirection = options.preferredDirection || null;
    const strictPreferred = options.strictPreferred ?? false;
    const preferredSide = options.preferredSide || null;

    let momentumSide = parent.bornSide;
    if (momentumSide !== "left" && momentumSide !== "right") {
      if (preferredSide === "left" || preferredSide === "right") {
        momentumSide = preferredSide;
      } else if (preferredDirection === -1) {
        momentumSide = "left";
      } else if (preferredDirection === 1) {
        momentumSide = "right";
      } else {
        momentumSide = Math.random() < 0.5 ? "left" : "right";
      }
    }

    const leftHorizontal = [{ dx: -1, dy: 0 }];
    const rightHorizontal = [{ dx: 1, dy: 0 }];
    const leftDiagonals = shuffledPair({ dx: -1, dy: -1 }, { dx: -1, dy: 1 });
    const rightDiagonals = shuffledPair({ dx: 1, dy: -1 }, { dx: 1, dy: 1 });
    const verticals = shuffledPair({ dx: 0, dy: -1 }, { dx: 0, dy: 1 });

    const weightedMoves = [];
    const pushTier = (moves, weight) => {
      for (const move of moves) {
        weightedMoves.push({ move, weight });
      }
    };

    if (momentumSide === "left") {
      pushTier(leftHorizontal, MOMENTUM_WEIGHTS.PRIMARY_HORIZONTAL);
      pushTier(leftDiagonals, MOMENTUM_WEIGHTS.PRIMARY_DIAGONAL);
      pushTier(verticals, MOMENTUM_WEIGHTS.VERTICAL);
      if (Math.random() < SECONDARY_MOVE_CHANCE) {
        pushTier(rightDiagonals, MOMENTUM_WEIGHTS.SECONDARY_DIAGONAL);
        pushTier(rightHorizontal, MOMENTUM_WEIGHTS.SECONDARY_HORIZONTAL);
      }
    } else {
      pushTier(rightHorizontal, MOMENTUM_WEIGHTS.PRIMARY_HORIZONTAL);
      pushTier(rightDiagonals, MOMENTUM_WEIGHTS.PRIMARY_DIAGONAL);
      pushTier(verticals, MOMENTUM_WEIGHTS.VERTICAL);
      if (Math.random() < SECONDARY_MOVE_CHANCE) {
        pushTier(leftDiagonals, MOMENTUM_WEIGHTS.SECONDARY_DIAGONAL);
        pushTier(leftHorizontal, MOMENTUM_WEIGHTS.SECONDARY_HORIZONTAL);
      }
    }

    let filteredMoves = weightedMoves;

    if (strictPreferred && (preferredDirection === -1 || preferredDirection === 1)) {
      filteredMoves = filteredMoves.filter((item) => item.move.dx === preferredDirection);
    } else if (preferredDirection === -1 || preferredDirection === 1) {
      filteredMoves = filteredMoves.map((item) => ({
        move: item.move,
        weight: item.move.dx === preferredDirection ? item.weight * 1.12 : item.weight * 0.92,
      }));
    }

    return weightedMoveOrder(filteredMoves);
  }

  function tryAddBranch(now, options = {}) {
    const preferredDirection = options.preferredDirection || null;
    const strictPreferred = options.strictPreferred ?? false;
    const preferredSide = options.preferredSide || null;
    const forcedParentId = options.parentId ?? null;

    for (let attempt = 0; attempt < 12; attempt += 1) {
      let parent = null;
      if (forcedParentId !== null) {
        parent = nodes.get(forcedParentId) || null;
        if (!parent || parent.deathAt !== null) {
          return false;
        }
      } else {
        parent = chooseParentCandidate(now, preferredDirection, preferredSide);
      }

      if (!parent) {
        return false;
      }

      const moveOrder = momentumMovesFor(parent, {
        preferredDirection,
        strictPreferred,
        preferredSide,
      });

      for (const move of moveOrder) {
        const nextX = parent.x + move.dx;
        const row = parent.y + move.dy;
        if (nextX < MIN_X || nextX > MAX_X) {
          continue;
        }
        if (row < 1 || row > GRID_HEIGHT) {
          continue;
        }

        const key = keyFor(nextX, row);
        if (occupied.has(key)) {
          continue;
        }
        if (!isAdjacentToParent(parent, nextX, row)) {
          continue;
        }
        if (hasInvalidNeighbor(nextX, row, parent.id)) {
          continue;
        }

        createNode(parent.id, nextX, row, now);
        return true;
      }
    }

    return false;
  }

  function countActiveSides() {
    let left = 0;
    let right = 0;

    for (const node of nodes.values()) {
      if (node.deathAt !== null) {
        continue;
      }
      if (node.x < ROOT_X) {
        left += 1;
      } else if (node.x > ROOT_X) {
        right += 1;
      }
    }

    return { left, right };
  }

  function tryPruneLeaf(now) {
    const leaves = [];

    for (const node of nodes.values()) {
      if (node.id === ROOT_ID) {
        continue;
      }
      if (node.deathAt !== null) {
        continue;
      }
      if (node.children.size !== 0) {
        continue;
      }
      leaves.push(node);
    }

    if (leaves.length === 0) {
      return false;
    }

    leaves.sort(
      (a, b) => Math.abs(b.x - ROOT_X) - Math.abs(a.x - ROOT_X) || a.bornAt - b.bornAt
    );
    const pickWindow = Math.max(1, Math.floor(leaves.length * 0.45));
    const victim = leaves[Math.floor(Math.random() * pickWindow)];
    victim.deathAt = now;
    return true;
  }

  function forceRemoveSubtree(startId) {
    if (startId === ROOT_ID) {
      return;
    }

    const stack = [startId];
    const toDelete = new Set();

    while (stack.length > 0) {
      const id = stack.pop();
      if (toDelete.has(id)) {
        continue;
      }

      toDelete.add(id);
      const node = nodes.get(id);
      if (!node) {
        continue;
      }

      for (const childId of node.children) {
        stack.push(childId);
      }
    }

    const ordered = Array.from(toDelete).sort((a, b) => {
      const nodeA = nodes.get(a);
      const nodeB = nodes.get(b);
      return (nodeB ? nodeB.x : 0) - (nodeA ? nodeA.x : 0);
    });

    for (const id of ordered) {
      const node = nodes.get(id);
      if (!node || id === ROOT_ID) {
        continue;
      }

      const parent = nodes.get(node.parentId);
      if (parent) {
        parent.children.delete(id);
      }

      occupied.delete(keyFor(node.x, node.y));
      nodes.delete(id);
    }
  }

  function cleanupDeadNodes(now) {
    const toDelete = [];

    for (const node of nodes.values()) {
      if (node.id === ROOT_ID || node.deathAt === null) {
        continue;
      }
      if (node.children.size > 0) {
        continue;
      }
      if (now - node.deathAt >= NODE_SHRINK_MS) {
        toDelete.push(node.id);
      }
    }

    for (const id of toDelete) {
      const node = nodes.get(id);
      if (!node) {
        continue;
      }

      const parent = nodes.get(node.parentId);
      if (parent) {
        parent.children.delete(id);
      }

      occupied.delete(keyFor(node.x, node.y));
      nodes.delete(id);
    }
  }

  function detectCycle() {
    const color = new Map();
    const path = [];
    let cycle = null;

    function dfs(id) {
      color.set(id, 1);
      path.push(id);

      const node = nodes.get(id);
      if (node) {
        for (const childId of node.children) {
          if (!nodes.has(childId)) {
            continue;
          }

          const state = color.get(childId) || 0;
          if (state === 1) {
            const cycleStart = path.indexOf(childId);
            cycle = path.slice(cycleStart);
            return true;
          }

          if (state === 0 && dfs(childId)) {
            return true;
          }
        }
      }

      path.pop();
      color.set(id, 2);
      return false;
    }

    for (const id of nodes.keys()) {
      if ((color.get(id) || 0) !== 0) {
        continue;
      }
      if (dfs(id)) {
        return cycle;
      }
    }

    return null;
  }

  function resolveCycles() {
    let guard = 0;

    while (guard < 5) {
      const cycle = detectCycle();
      if (!cycle || cycle.length === 0) {
        return;
      }

      const candidates = cycle.filter((id) => id !== ROOT_ID && nodes.has(id));
      if (candidates.length === 0) {
        return;
      }

      let victimId = candidates[0];
      for (const id of candidates) {
        const node = nodes.get(id);
        const victimNode = nodes.get(victimId);
        if (node && victimNode && node.x >= victimNode.x) {
          victimId = id;
        }
      }

      forceRemoveSubtree(victimId);
      guard += 1;
    }
  }

  function evolveGraph(now) {
    const elapsed = now - lastMutationAt;
    if (elapsed < MUTATION_INTERVAL_MS) {
      return;
    }

    const stepCount = Math.min(6, Math.floor(elapsed / MUTATION_INTERVAL_MS));

    for (let i = 0; i < stepCount; i += 1) {
      const stepTime = lastMutationAt + MUTATION_INTERVAL_MS * (i + 1);
      const activeCount = Array.from(nodes.values()).filter((node) => node.deathAt === null).length;

      let addProbability = 0.66;
      let pruneProbability = 0.2;

      if (activeCount < 24) {
        addProbability = 0.92;
        pruneProbability = 0.06;
      } else if (activeCount > 56) {
        addProbability = 0.35;
        pruneProbability = 0.57;
      }

      const outwardBias = activeCount < 34 ? 0.9 : 0.76;
      const sideCounts = countActiveSides();
      const sideTarget = sideCounts.left <= sideCounts.right ? "left" : "right";
      const preferredDirection = sideTarget === "left" ? -1 : 1;

      if (sideCounts.left === 0) {
        tryAddBranch(stepTime, {
          parentId: ROOT_ID,
          preferredDirection: -1,
          preferredSide: "left",
          outwardBias: 1,
          strictPreferred: true,
        });
      }
      if (sideCounts.right === 0) {
        tryAddBranch(stepTime, {
          parentId: ROOT_ID,
          preferredDirection: 1,
          preferredSide: "right",
          outwardBias: 1,
          strictPreferred: true,
        });
      }

      if (Math.random() < addProbability) {
        if (
          !tryAddBranch(stepTime, {
            preferredDirection,
            preferredSide: sideTarget,
            outwardBias,
            strictPreferred: true,
          })
        ) {
          tryAddBranch(stepTime, {
            preferredDirection,
            preferredSide: sideTarget,
            outwardBias,
          });
        }
      }
      if (Math.random() < addProbability * 0.3) {
        tryAddBranch(stepTime, { outwardBias });
      }

      if (Math.random() < pruneProbability) {
        tryPruneLeaf(stepTime);
      }
      if (Math.random() < pruneProbability * 0.2) {
        tryPruneLeaf(stepTime);
      }

      cleanupDeadNodes(stepTime);
      resolveCycles();
    }

    lastMutationAt += stepCount * MUTATION_INTERVAL_MS;
  }

  function buildRenderSnapshot(now) {
    const byId = new Map();
    const renderNodes = [];
    const edges = [];
    const orderedNodes = [];
    const seen = new Set();
    const queue = [ROOT_ID];

    while (queue.length > 0) {
      const id = queue.shift();
      if (seen.has(id)) {
        continue;
      }
      seen.add(id);

      const node = nodes.get(id);
      if (!node) {
        continue;
      }

      orderedNodes.push(node);

      const children = Array.from(node.children)
        .map((childId) => nodes.get(childId))
        .filter(Boolean)
        .sort((a, b) => a.x - b.x || a.y - b.y || a.id - b.id);

      for (const child of children) {
        queue.push(child.id);
      }
    }

    for (const node of orderedNodes) {
      const growth = getNodeGrowth(node, now);
      if (growth <= 0.01) {
        continue;
      }

      const finalPos = gridToCanvas(node);

      if (node.parentId === null) {
        const rootNode = {
          id: node.id,
          x: finalPos.x,
          y: finalPos.y,
          radius: ballRadius,
          visible: true,
        };
        byId.set(node.id, rootNode);
        renderNodes.push(rootNode);
        continue;
      }

      const parentRender = byId.get(node.parentId);
      if (!parentRender) {
        continue;
      }

      const eased = easeOutCubic(growth);
      const x = parentRender.x + (finalPos.x - parentRender.x) * eased;
      const y = parentRender.y + (finalPos.y - parentRender.y) * eased;
      const radius = ballRadius * (0.18 + eased * 0.82);

      const renderNode = {
        id: node.id,
        x,
        y,
        radius,
        visible: true,
      };

      byId.set(node.id, renderNode);
      renderNodes.push(renderNode);
      edges.push({ from: node.parentId, to: node.id });
    }

    return { byId, renderNodes, edges };
  }

  function drawMetaballBridge(ballA, ballB) {
    const dx = ballB.x - ballA.x;
    const dy = ballB.y - ballA.y;
    const distance = Math.hypot(dx, dy);
    const r1 = ballA.radius;
    const r2 = ballB.radius;

    if (distance <= Math.abs(r1 - r2) || distance <= 0.001) {
      return;
    }

    const maxDistance = Math.max(gridStepX, gridStepY) * 1.9;
    if (distance > maxDistance) {
      return;
    }

    let u1 = 0;
    let u2 = 0;

    if (distance < r1 + r2) {
      u1 = Math.acos(clamp((r1 * r1 + distance * distance - r2 * r2) / (2 * r1 * distance), -1, 1));
      u2 = Math.acos(clamp((r2 * r2 + distance * distance - r1 * r1) / (2 * r2 * distance), -1, 1));
    }

    const angleBetween = Math.atan2(dy, dx);
    const maxSpread = Math.acos(clamp((r1 - r2) / distance, -1, 1));
    const v = 0.5;

    const angle1a = angleBetween + u1 + (maxSpread - u1) * v;
    const angle1b = angleBetween - u1 - (maxSpread - u1) * v;
    const angle2a = angleBetween + Math.PI - u2 - (Math.PI - u2 - maxSpread) * v;
    const angle2b = angleBetween - Math.PI + u2 + (Math.PI - u2 - maxSpread) * v;

    const p1a = pointOnCircle(ballA.x, ballA.y, r1, angle1a);
    const p1b = pointOnCircle(ballA.x, ballA.y, r1, angle1b);
    const p2a = pointOnCircle(ballB.x, ballB.y, r2, angle2a);
    const p2b = pointOnCircle(ballB.x, ballB.y, r2, angle2b);

    const totalRadius = r1 + r2;
    const baseHandle = Math.min(1.2, Math.hypot(p1a.x - p2a.x, p1a.y - p2a.y) / totalRadius);
    const handleScale = baseHandle * Math.min(1, (distance * 2) / totalRadius);

    const h1 = pointFrom(p1a, angle1a - Math.PI / 2, r1 * handleScale);
    const h2 = pointFrom(p2a, angle2a + Math.PI / 2, r2 * handleScale);
    const h3 = pointFrom(p2b, angle2b - Math.PI / 2, r2 * handleScale);
    const h4 = pointFrom(p1b, angle1b + Math.PI / 2, r1 * handleScale);

    ctx.beginPath();
    ctx.moveTo(p1a.x, p1a.y);
    ctx.bezierCurveTo(h1.x, h1.y, h2.x, h2.y, p2a.x, p2a.y);
    ctx.lineTo(p2b.x, p2b.y);
    ctx.bezierCurveTo(h3.x, h3.y, h4.x, h4.y, p1b.x, p1b.y);
    ctx.closePath();
    ctx.fill();
  }

  function drawScene(now) {
    const { byId, renderNodes, edges } = buildRenderSnapshot(now);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#4ade80";

    for (const edge of edges) {
      const from = byId.get(edge.from);
      const to = byId.get(edge.to);
      if (!from || !to || !to.visible) {
        continue;
      }
      drawMetaballBridge(from, to);
    }

    for (const node of renderNodes) {
      if (!node.visible) {
        continue;
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function render(now) {
    evolveGraph(now);
    drawScene(now);
    rafId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();
  initializeGraph(performance.now());
  rafId = requestAnimationFrame(render);

  return {
    cleanup: () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    },
  };
}
