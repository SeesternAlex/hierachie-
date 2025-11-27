var fs = require("fs");
var sharp = require("sharp");
var { Client } = require("pg");
require('dotenv').config();  // Lädt .env-Variablen ganz oben

// PostgreSQL-Konfiguration aus Umgebungsvariablen
var dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432
};

// Rest des Codes bleibt unverändert...
async function getRolesFromDb() {
  var client = new Client(dbConfig);
  await client.connect();
  var res = await client.query("SELECT id, name, parentid FROM rollen");
  await client.end();
  return res.rows.map(function(r) {
    return { id: r.id, name: r.name, parentId: r.parentid };
  });
}

function buildHierarchy(e) {
  var n = new Map(), t = [];
  e.forEach(function(e){ n.set(e.id, Object.assign({}, e, {children: []})); });
  e.forEach(function(e){
    if (e.parentId) {
      var parent = n.get(e.parentId);
      parent && parent.children.push(n.get(e.id));
    } else t.push(n.get(e.id));
  });
  return t;
}

function generateSVG(e) {
  var verticalSpacing = 110, horizontalSpacing = 32;
  var charWidth = 17, minNodeWidth = 190, fontSize = 19;
  var leftMargin = 130, topMargin = 120;

  var svgParts = [], maxWidth = 0, maxHeight = 0;

  function setNodeWidths(node) {
    node.nodeWidth = Math.max(charWidth * node.name.length, minNodeWidth);
    node.nodeHeight = 68;
    node.children.forEach(setNodeWidths);
  }
  e.forEach(setNodeWidths);

  function getSubtreeWidth(node) {
    if(!node.children.length) return node.nodeWidth;
    var widths = node.children.map(getSubtreeWidth);
    return widths.reduce((a, b) => a + b, 0) + horizontalSpacing * (node.children.length -1);
  }

  function layout(node, depth, xOffset) {
    var subtreeWidth = getSubtreeWidth(node);
    node.x = leftMargin + xOffset + (subtreeWidth - node.nodeWidth) / 2;
    node.y = topMargin + depth * (node.nodeHeight + verticalSpacing);

    maxWidth = Math.max(maxWidth, node.x + node.nodeWidth + leftMargin);
    maxHeight = Math.max(maxHeight, node.y + node.nodeHeight + topMargin);

    var nextOffset = xOffset;
    node.children.forEach(function(child){
      var childWidth = getSubtreeWidth(child);
      layout(child, depth +1, nextOffset);
      nextOffset += childWidth + horizontalSpacing;
    });
  }

  var treeOffset = 0;
  e.forEach(function(root){
    var rootWidth = getSubtreeWidth(root);
    layout(root, 0, treeOffset);
    treeOffset += rootWidth + horizontalSpacing;
  });

  function drawNode(node) {
    svgParts.push('<rect x="' + node.x + '" y="' + node.y + '" width="' + node.nodeWidth + '" height="' + node.nodeHeight + '" fill="#e0e0e0" stroke="#333" rx="11"/>');
    svgParts.push('<text x="' + (node.x + 15) + '" y="' + (node.y + node.nodeHeight / 2 + fontSize / 2) + '" font-family="Arial" font-size="' + fontSize + '">' + node.name + '</text>');
    node.children.forEach(function(child){
      var parentCenter = node.x + node.nodeWidth / 2;
      var childCenter = child.x + child.nodeWidth / 2;
      svgParts.push('<line x1="' + parentCenter + '" y1="' + (node.y + node.nodeHeight) + '" x2="' + childCenter + '" y2="' + child.y + '" stroke="#aaa" stroke-width="2"/>');
      drawNode(child);
    });
  }
  e.forEach(drawNode);

  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + maxWidth + '" height="' + maxHeight + '">' + svgParts.join('') + '</svg>';
}

async function main() {
  try {
    var rollen = await getRolesFromDb();
    var svg = generateSVG(buildHierarchy(rollen));
    fs.writeFileSync("tree.svg", svg);
    await sharp(Buffer.from(svg)).png().toFile("tree.png");
    console.log("SVG und PNG Dateien wurden gespeichert.");
  } catch (err) {
    console.error("Fehler:", err);
  }
}

main();
