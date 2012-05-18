var Connection, EventEmitter, Server,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

EventEmitter = require('events').EventEmitter;

Connection = (function(_super) {

  __extends(Connection, _super);

  function Connection(sjsConn) {
    var _this = this;
    this.sjsConn = sjsConn;
    this.headers = this.sjsConn.headers;
    this.address = this.sjsConn.address;
    this.readyState = 1;
    this.sjsConn.dataHandler(function(buffer) {
      var msg;
      msg = buffer.getString(0, buffer.length());
      return _this.emit('data', msg);
    });
  }

  Connection.prototype.close = function() {
    return this.sjsConn.close();
  };

  Connection.prototype.end = function() {
    return this.sjsConn.close();
  };

  Connection.prototype.write = function(msg) {
    var buff;
    buff = new vertx.Buffer(msg);
    return this.sjsConn.writeBuffer(buff);
  };

  return Connection;

})(EventEmitter);

Server = (function(_super) {

  __extends(Server, _super);

  function Server(options) {
    this.addOptions(options);
  }

  Server.prototype.addOptions = function(options) {
    if (options == null) return;
    if (this.options == null) this.options = {};
    if (options["prefix"] != null) {
      return this.options["prefix"] = options["prefix"];
    }
  };

  Server.prototype.installHandlers = function(http_server, handler_options) {
    var _this = this;
    this.httpServer = http_server.vertxServer;
    console.log("HTTP Server = " + http_server);
    this.sjsServer = new vertx.createSockJSServer(this.httpServer);
    this.addOptions(handler_options);
    return this.sjsServer.installApp(this.options, function(conn) {
      return _this.emit('connection', new Connection(conn));
    });
  };

  return Server;

})(EventEmitter);

exports.createServer = function(options) {
  return new Server(options);
};
