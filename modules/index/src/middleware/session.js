/**
 * Session middleware
 * @module index/middleware/session
 */
const BaseService = require('arpen-express/src/middleware/session');

/**
 * User session
 */
class Session extends BaseService {
    /**
     * Register middleware
     * @param {Express} server          The server
     * @return {Promise}
     */
    async register(server) {
        let config = this._config.get(`servers.${server.name}.session`);
        if (!config)
            return;

        let bridge = this._app.get(config.bridge, server.name);
        await this._session.addBridge(server.name, bridge);

        server.express.use(async (req, res, next) => {
            req.session = res.locals.session = {};
            req.user = res.locals.user = null;

            let session;
            try {
                let token = req.cookies && bridge.tokenVar && req.cookies[bridge.tokenVar];
                if (token) {
                    let decoded = await this._session.decodeJwt(server.name, token, req);
                    session = decoded.session;
                }
                if (!session)
                    session = await this._session.create(server.name, null, req);
                if (session) {
                    Object.assign(req.session, session.payload);
                    res.locals.session = req.session;
                }
                req.user = res.locals.user = (session && session.user) || null;
            } catch (error) {
                this._logger.error(error);
            }

            let token;
            if (session) {
                token = await this._session.encodeJwt(server.name, session);
                if (req.session.started) {
                    req.session.server = server.name;
                    req.session.token = token;
                } else {
                    delete req.session.server;
                    delete req.session.token;
                }
            }

            let origEnd = res.end;
            res.end = async (...args) => {
                if (session) {
                    session.payload = req.session;
                    session.user = req.user;

                    try {
                        if (await this._session.update(server.name, session, req) && bridge.tokenVar) {
                            res.cookie(bridge.tokenVar, token, {
                                maxAge: 365 * 24 * 60 * 60 * 1000,
                                path: '/',
                                httpOnly: false
                            });
                        }
                    } catch (error) {
                        this._logger.error(error);
                    }
                }

                origEnd.apply(res, args);
            };

            next();
        });
    }
}

module.exports = Session;
