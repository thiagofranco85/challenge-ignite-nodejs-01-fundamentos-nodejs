import http from 'node:http'
import { mdwReqBodyToJson } from './middlewares/mdwReqBodyToJson.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {

    await mdwReqBodyToJson(req, res)

    const { method, url } = req

    const route = routes.find(x => x.method === method && x.path.test(url))

    if (route) {

        const routeParams = req.url.match(route.path)

        const { query, ...params } = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)

    } else {

        res.writeHead(404).end('{ "message": "Rota não encontrada" }')
    }

})

server.listen(3333)