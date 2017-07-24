exports.dataFile = (req) => {
  const authorization = req.headers['authorization'];
  const financialId = req.headers['x-fapi-financial-id'];
  const filePath = '/' + financialId + '/' + authorization;
  const resource = req.path.replace('/open-banking', filePath);
  return `./data${resource}.json`;
}
