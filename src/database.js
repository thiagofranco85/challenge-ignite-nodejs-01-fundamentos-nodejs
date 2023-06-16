import fs from 'node:fs/promises'
import { validateHeaderValue } from 'node:http'

const dataBasePath = new URL('../db.json', import.meta.url)

export class Database {

    #database = {}

    constructor() {
        fs.readFile(dataBasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }
    //
    #persist() {
        fs.writeFile(dataBasePath, JSON.stringify(this.#database, null, 2))
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    select(table, search) {
        let data = Array.isArray(this.#database[table]) ? this.#database[table] : []

        if (Object.entries(search).length > 0) {

            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })

        }

        return data
    }

    update(table, id, params) {

        const index = this.#database[table].findIndex(row => row.id === id)
        const data = this.#database[table][index]

        if (index > -1) {
            this.#database[table][index] = { id, ...data, ...params }
            this.#persist()
        }

    }

    delete(table, id) {
        const index = this.#database[table].findIndex(x => x.id === id)

        if (index > -1) {
            this.#database[table].splice(index, 1)
            this.#persist()
        }
    }
}