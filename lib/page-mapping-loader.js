const fs = require('fs');
const path = require('path');

/**
 * 加载 json-page.json 映射文件
 * @param {string} mappingFilePath - json-page.json 文件路径
 * @returns {Array} 映射数组
 */
function loadPageMapping(mappingFilePath) {
  if (!fs.existsSync(mappingFilePath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(mappingFilePath, 'utf8');
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`读取页面映射文件失败: ${error.message}`);
    return [];
  }
}

/**
 * 根据 JSON 文件路径列表，从映射中查找对应的 wiki 页面路径
 * @param {Array} mapping - 映射数组
 * @param {Array} jsonPaths - JSON 文件相对路径列表
 * @returns {Array} wiki 页面路径列表（去重）
 */
function findWikiPathsByJsonPaths(mapping, jsonPaths) {
  if (!mapping || !jsonPaths || jsonPaths.length === 0) {
    return [];
  }

  const jsonPathSet = new Set(
    jsonPaths.map(p => p.replace(/\\/g, '/'))
  );

  const wikiPaths = new Set();
  for (const entry of mapping) {
    if (!entry.jsonPath || !entry.wikiPath) {
      continue;
    }
    const normalizedJsonPath = entry.jsonPath.replace(/\\/g, '/');
    if (jsonPathSet.has(normalizedJsonPath)) {
      wikiPaths.add(entry.wikiPath);
    }
  }

  return Array.from(wikiPaths);
}

/**
 * 加载映射文件并返回所有 wiki 路径
 * @param {string} mappingFilePath - 映射文件路径
 * @returns {Array} 所有 wiki 路径
 */
function loadAllWikiPaths(mappingFilePath) {
  const mapping = loadPageMapping(mappingFilePath);
  const wikiPaths = new Set();
  for (const entry of mapping) {
    if (entry.wikiPath) {
      wikiPaths.add(entry.wikiPath);
    }
  }
  return Array.from(wikiPaths);
}

module.exports = {
  loadPageMapping,
  findWikiPathsByJsonPaths,
  loadAllWikiPaths
};
