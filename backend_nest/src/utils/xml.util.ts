

export const plainParserToDom = (xmlStr): Document => {
  let xmlParser = new DOMParser(); //DOM파서 객체를 생성
  return xmlParser.parseFromString(xmlStr, 'text/xml');
}

/**
 * xml2js 이용
 * @param data
 */
export const parseToJson = async (xmlStr) => {
  const xml2js = require('xml2js');
  const parser = new xml2js.Parser(/* options */);
  return await parser.parseStringPromise(xmlStr);
}
