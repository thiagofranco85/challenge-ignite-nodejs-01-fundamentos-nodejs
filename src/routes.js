import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
const database = new Database()

import { importaPlanilha } from './utils/csv-parse.js'

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {

            const { title, description } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert('tasks', task)
            res.writeHead(201).end()

        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const queryParams = req.query

            const data = database.select('tasks', queryParams)
            return res.end(JSON.stringify(data))
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if (!title || !description) {
                return res.writeHead(400).end('{"message": "title or description are required"}')
            }

            const [task] = database.select('tasks', { id })

            if (!task) {
                return res.writeHead(400).end('{"message": "Task doesn\'t exist"}')
            }

            const data = database.update('tasks', id, { title, description, updated_at: new Date() })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const [task] = database.select('tasks', { id })

            if (!task) {
                return res.writeHead(400).end('{"message": "Task doesn\'t exist"}')
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const [task] = database.select('tasks', { id })

            if (!task) {
                res.writeHead(404).end('{"message": "Task doesn\'t exist"}')
            }

            const completed_at = task.completed_at ? null : new Date()

            database.update('tasks', id, { completed_at })

            return res.writeHead(204).end()


        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/import-spreadsheet'),
        handler: (req, res) => {
            importaPlanilha();
            return res.writeHead(201).end()
        }
    }
]