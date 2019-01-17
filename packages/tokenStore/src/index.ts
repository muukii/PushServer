import * as express from 'express'
import * as storage from 'node-persist'
import { lookup } from 'dns';


export async function setup() {

    await storage.init({dir: '/tmp/pushserver_tokenstore.db'})
}

export async function putToken(request: express.Request, response: express.Response) {

    const key = request.body['key']
    const deviceToken = request.body['device_token']

    console.log(`### key: ${key}`)
    console.log(`### device_token: ${deviceToken}`)

    if (key && deviceToken) {
        await storage.setItem(key, deviceToken)
    }

    response.sendStatus(200)
}

export async function lookupToken(request: express.Request, response: express.Response, next: express.NextFunction) {

    if (request.header('x-target-device-token')) {
        // use deviceToken in header instead of looking up
        return next()
    }

    const __deviceTokenLookupKeyHeader = process.env.__DEVICE_TOKEN_LOOKUP_KEY_HEADER
    if (!__deviceTokenLookupKeyHeader) {
        console.log('environment variable __DEVICE_TOKEN_LOOKUP_KEY_HEADER not provided')
        return next()
    }

    let lookupKey = request.header(__deviceTokenLookupKeyHeader)
    if (!lookupKey) {
        console.log('lookup key not provided in header')
        return next()
    }

    const deviceToken = await storage.getItem(lookupKey)
    if (!deviceToken) {
        console.log(`device token not found for key: ${lookupKey}`)
        return next()
    }

    console.log(`looked up device_token: ${deviceToken} by key: ${lookupKey}`)

    request.headers['x-target-device-token'] = deviceToken
    next()
}
