{EventEmitter} = require('events')

class Connection extends EventEmitter
  constructor: (@sjsConn) ->
    @headers = @sjsConn.headers
    @address = @sjsConn.address

    # Connection is ready
    @readyState = 1

    @sjsConn.dataHandler (buffer) =>
      msg = buffer.getString 0, buffer.length()
      @emit 'data', msg

  close: -> @sjsConn.close()

  end: -> @sjsConn.close()

  write: (msg) ->
     buff = new vertx.Buffer(msg)
     @sjsConn.writeBuffer buff

class Server extends EventEmitter

  constructor: (options) ->
    @addOptions options

  addOptions: (options) ->
    return unless options?

    @options ?= {}
    @options["prefix"] = options["prefix"] if options["prefix"]?
    # TODO - Add other properties
    # res["insert_JSESSIONID"] = options["jsessionid"] if options["jsessionid"]?

  installHandlers: (http_server, handler_options) ->
    @httpServer = http_server.vertxServer # get the vertxHttpServer
    @sjsServer = new vertx.createSockJSServer(@httpServer)

    # overwrite options
    @addOptions handler_options

    @sjsServer.installApp @options, (conn) => @emit 'connection', new Connection(conn)

exports.createServer = (options) ->
    return new Server(options)
