const fs = require("fs"),
  sharp = require("sharp"),
  rollen = [
  { id: 1, name: "Bundespräsident (Oberbefehlshaber)", parentId: null },
  { id: 2, name: "Bundesminister für Landesverteidigung", parentId: 1 },
  { id: 3, name: "Chef des Generalstabes", parentId: 2 },
  { id: 4, name: "Kommandant Streitkräftekommando", parentId: 3 },
  { id: 5, name: "Brigadekommandant", parentId: 4 },
  { id: 6, name: "Regimentskommandant", parentId: 5 },
  { id: 7, name: "Kompaniekommandant (Hauptmann)", parentId: 6 },
  { id: 8, name: "Oberleutnant", parentId: 7 },
  { id: 9, name: "Zugskommandant (Leutnant)", parentId: 7 },
  { id: 10, name: "Gruppenkommandant (Wachtmeister)", parentId: 8 },
  { id: 11, name: "Oberfeldwebel", parentId: 10 },
  { id: 12, name: "Feldwebel", parentId: 11 },
  { id: 13, name: "Stabswachtmeister", parentId: 12 },
  { id: 14, name: "Oberstabswachtmeister", parentId: 13 },
  { id: 15, name: "Stabsunteroffizier", parentId: 14 },
  { id: 16, name: "Hauptfeldwebel", parentId: 15 },
  { id: 17, name: "Major", parentId: 6 },
  { id: 18, name: "Oberstleutnant", parentId: 6 },
  { id: 19, name: "Oberst", parentId: 5 },
  { id: 20, name: "Brigadier", parentId: 4 },
  { id: 21, name: "Generalmajor", parentId: 3 },
  { id: 22, name: "Generalleutnant", parentId: 3 },
  { id: 23, name: "General", parentId: 3 },
  { id: 24, name: "Soldat (Gefreiter)", parentId: 25 },
  { id: 25, name: "Rekrut", parentId: 10 },
  { id: 26, name: "Zugsführer", parentId: 25 },
  { id: 27, name: "Obergefreiter", parentId: 25 },
  { id: 28, name: "Sanitäter", parentId: 10 },
  { id: 29, name: "Pionier", parentId: 10 },
  { id: 30, name: "Logistiker", parentId: 10 },
  { id: 31, name: "Vizeleutnant", parentId: 9 },
  { id: 32, name: "Oberstabsleutnant", parentId: 18 },
  { id: 33, name: "Leutnant", parentId: 9 },
  { id: 34, name: "Fahnenjunker", parentId: 33 },
  { id: 35, name: "Generalstabsarzt", parentId: 3 },
  { id: 36, name: "Militärkommandant", parentId: 5 },
  { id: 37, name: "Milizführer", parentId: 6 },
  { id: 38, name: "Hangarchef (Luftstreitkräfte)", parentId: 6 },
  { id: 39, name: "Fliegeroffizier", parentId: 8 },
  { id: 40, name: "Technikoffizier", parentId: 7 },
  { id: 41, name: "Cyberabwehr Spezialist", parentId: 10 }
];

function buildHierarchy(e) {
  const n = new Map(), t = [];
  e.forEach((e) => n.set(e.id, { ...e, children: [] }));
  e.forEach((e) => {
    if (e.parentId) {
      const t2 = n.get(e.parentId);
      t2 && t2.children.push(n.get(e.id));
    } else t.push(n.get(e.id));
  });
  return t;
}

// Neue, schönere SVG-Baumfunktion!
function generateSVG(e) {
  const verticalSpacing = 130;
  const horizontalSpacing = 32;
  const charWidth = 17;
  const minNodeWidth = 190;
  const fontSize = 19;
  const leftMargin = 130;
  const topMargin = 120;

  let t = [], a = 0, r = 0;

  function setNodeWidths(node) {
    node.nodeWidth = Math.max(charWidth * node.name.length, minNodeWidth);
    node.nodeHeight = 68;
    node.children.forEach(setNodeWidths);
  }
  e.forEach(setNodeWidths);

  function getSubtreeWidth(node) {
    if (!node.children.length) return node.nodeWidth;
    const childrenWidths = node.children.map(getSubtreeWidth);
    return Math.max(node.nodeWidth, childrenWidths.reduce((a, b) => a + b, 0) + horizontalSpacing * (node.children.length - 1));
  }

  function layout(node, depth, xOffset) {
    const subtreeWidth = getSubtreeWidth(node);
    node.x = leftMargin + xOffset + (subtreeWidth - node.nodeWidth) / 2;
    node.y = topMargin + depth * (node.nodeHeight + verticalSpacing);

    a = Math.max(a, node.x + node.nodeWidth + leftMargin);
    r = Math.max(r, node.y + node.nodeHeight + topMargin);

    let nextOffset = xOffset;
    node.children.forEach(child => {
      const childWidth = getSubtreeWidth(child);
      layout(child, depth + 1, nextOffset);
      nextOffset += childWidth + horizontalSpacing;
    });
  }

  let treeOffset = 0;
  e.forEach(root => {
    const rootWidth = getSubtreeWidth(root);
    layout(root, 0, treeOffset);
    treeOffset += rootWidth + horizontalSpacing;
  });

  function drawNode(node) {
    t.push(`<rect x="${node.x}" y="${node.y}" width="${node.nodeWidth}" height="${node.nodeHeight}" fill="#e0e0e0" stroke="#333" rx="11"/>`);
    t.push(`<text x="${node.x + 15}" y="${node.y + node.nodeHeight / 2 + fontSize/2}" font-family="Arial" font-size="${fontSize}">${node.name}</text>`);
    node.children.forEach(child => {
      let parentCenter = node.x + node.nodeWidth / 2;
      let childCenter  = child.x + child.nodeWidth / 2;
      t.push(`<line x1="${parentCenter}" y1="${node.y + node.nodeHeight}" x2="${childCenter}" y2="${child.y}" stroke="#aaa" stroke-width="2"/>`);
      drawNode(child);
    });
  }
  e.forEach(drawNode);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${a}" height="${r}">${t.join('')}</svg>`;
}

async function main() {
  const e = generateSVG(buildHierarchy(rollen));
  fs.writeFileSync("tree.svg", e),
    await sharp(Buffer.from(e)).png().toFile("tree.png"),
    console.log("SVG und PNG Dateien wurden gespeichert.");
}
main().catch(console.error);
