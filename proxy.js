const http = require("http");
const net = require("net");
const url = require("url");

function request(cReq, cRes) {
  const u = url.parse(cReq.url);
  const options = {
    hostname: u.hostname,
    prot: u.port || 80,
    path: u.path,
    method: cReq.method,
    headers: cReq.headers
  };
  var pReq = http
    .request(options, pRes => {
      cRes.writeHead(pRes.statusCode, pRes.headers);
      pRes.pipe(cRes);
      console.log("request");
    })
    .on("error", e => {
      cRes.end();
    });

  cReq.pipe(pReq);
}

function connect(cReq, cSock) {
  const u = url.parse("http://" + cReq.url);
  const pSock = net
    .connect(u.port, u.hostname, () => {
      cSock.write("HTTP/1.1 200 Connection Established\r\n\r\n");
      pSock.pipe(cSock);
      console.log("connect");
    })
    .on("error", e => {
      cSock.end();
    });

  cSock.pipe(pSock);
}

http
  .createServer()
  .on("request", request)
  .on("connect", connect)
  .listen(8888, "0.0.0.0");

console.log("proxy start success");
