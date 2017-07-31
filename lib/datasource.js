const sem = require('swagger-express-middleware');
const MemoryDataStore = sem.MemoryDataStore;
const Resource = sem.Resource;
const memStore = new MemoryDataStore();
const fs = require('fs');

const loadResource = file => {
  const path = file.replace('./data', '').replace('.json', '');
  const json = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(json);
  return new Resource(path, data);
}

const loadResources = dir => {
  let resources = [];
  fs.readdirSync(dir).forEach(path => {
    path = dir + '/' + path;
    const stat = fs.statSync(path);
    if (stat && stat.isDirectory()) {
      resources = resources.concat(loadResources(path));
    } else {
      resources.push(loadResource(path));
    }
  });
  return resources;
}

const initResources = done => {
  const resources = loadResources('./data');
  memStore.save(resources, (err, list) => {
    done();
  });
}

const dataPath = req => {
  const authorization = req.headers['authorization'];
  const financialId = req.headers['x-fapi-financial-id'];
  const filePath = '/' + financialId + '/' + authorization;
  return req.path.replace('/open-banking', filePath);
}

const mockData = (req, done) => {
  const path = dataPath(req);
  memStore.get(path, (err, resource) => {
    if (err || !resource || !resource.data) {
      done(null);
    } else {
      done(resource.data);
    }
  });
}

exports.initResources = initResources;
exports.mockData = mockData;
