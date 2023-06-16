import assert from 'assert';
import { parse } from 'csv-parse';
import fs from 'node:fs/promises'


export async function importaPlanilha() {

    const csvPathObj = new URL('../../data.csv', import.meta.url)

    const contentFileCsv = await fs.readFile(csvPathObj, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        return data;
    });

    const parseCsv = parse({
        delimiter: ['\n', ',']
    });

    parseCsv.write(contentFileCsv)

    let cont = 0
    let recordPost = {}
    let arrRecordPost = []

    async function listRecords() {
        for await (const record of parseCsv) {
            if (cont > 0) {
                let task = record[0]
                let description = record[1]
                //console.log(task, description)
                recordPost = {
                    title: task,
                    description: description
                }

                arrRecordPost.push(recordPost)
            }
            cont++
        }

        return arrRecordPost
    }

    const records = listRecords().then(resp => {

        let data = resp.map(rec => {

            fetch('http://localhost:3333/tasks', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rec)
            })
        })
    })


    /*

    async function start() {
        const url = "https://api.github.com/users/maybrito";
        const user = await fetch(url).then(r => r.json())
        const userRepos = await fetch(user.repos_url).then(r => r.json())
        return userRepos
    }

    start().then(x => console.log(x))
    
        fetch(
            'http://localhost:3333/tasks',
            {
                method: 'GET',
                contentType: 'application/json'
            }
        )
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
        
        
        */


    parseCsv.end()
}


