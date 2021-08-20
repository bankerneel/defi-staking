// send success response
const success = async (res, message, data = []) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify({
    statusCode: 200,
    data,
    message,
    statusMessage: 'success',
  }));
  res.end();
};

// send error response
const error = async (res, message, statusCode = 400, data = []) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify({
    statusCode,
    data,
    message,
    statusMessage: 'error',
  }));
  res.end();
};

// not authorized access response
const notAuthorized = async (res, message = 'Unauthorized access') => {
  res.writeHead(401, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify({
    statusCode: 401,
    data: [],
    message,
    statusMessage: 'error',
  }));
  res.end();
};

const pageRender = (res, pageName, renderParams) => {
  res.render(pageName, renderParams);
};

const dataForTable = (res, data) => {
  res.status(200).send(data);
};
module.exports.success = success;
module.exports.error = error;
module.exports.notAuthorized = notAuthorized;
module.exports.pageRender = pageRender;
module.exports.dataForTable = dataForTable;
