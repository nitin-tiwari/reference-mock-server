const sem = require('swagger-express-middleware');
const MemoryDataStore = sem.MemoryDataStore;
const Resource = sem.Resource;
const memStore = new MemoryDataStore();
const fs = require('fs');

const loadResource = (file) => {
  const path = file.replace('./data', '').replace('.json', '');
  const json = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(json);
  return new Resource(path, data);
}

memStore.save(
  loadResource('./data/abcbank/alice/accounts/123/transactions.json'),
);

const dataPath = (req) => {
  const authorization = req.headers['authorization'];
  const financialId = req.headers['x-fapi-financial-id'];
  const filePath = '/' + financialId + '/' + authorization;
  return req.path.replace('/open-banking', filePath);
}

const mockData = (req, callback) => {
  const path = dataPath(req);

  memStore.get(path, (err, resource) => {
    if (err || !resource || !resource.data) {
      callback(null);
    } else {
      callback(resource.data);
    }
  });
}

exports.mockData = mockData;
