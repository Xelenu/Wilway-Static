self.__uv$config = {
  prefix: "/cra/zim/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/cra/uv.handler.js",
  client:  "/cra/uv.client.js",
  bundle:  "/cra/uv.bundle.js",
  config:  "/cra/uv.config.js",
  sw:      "/cra/uv.sw.js",
};
