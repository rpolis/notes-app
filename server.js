const express = require('express')
const cors = require('cors')
const bodyarser = require('body-parser')
const app = express()
app.use(cors());
app.use(bodyarser.json())

const port = 1234
id = 1236
var boards = [{boardId:1234,boardTitle:'chandu'},{boardId:1235,boardTitle:'rohit'},{boardId:1236,boardTitle:'ramesh'}]

var notes = {
1234:[{
    "id": 437,
    "title": "test",
    "content": "Testing this application.",
    "created_at": "2018-12-20T04:52:28.078Z",
    "updated_at": "2018-12-20T14:12:10.521Z",
    "tags": []
}],
1235: [{
    "id": 440,
    "title": "dasdasd",
    "content": "wedqqew\n\n**asdasd** \nadsasdasd",
    "created_at": "2018-12-20T23:36:23.081Z",
    "updated_at": "2018-12-20T23:36:23.081Z",
    "tags": []
}],
1236: [{
    "id": 445,
    "title": "hfbn",
    "content": "nfgd ",
    "created_at": "2018-12-26T19:22:04.639Z",
    "updated_at": "2018-12-26T19:22:04.639Z",
    "tags": []
}]
}

app.get('/boards', function(req,res){
    res.send(JSON.stringify(boards))
})

app.post('/boards', function(req,res){
    if(req.body){
       id++;
       boards.push({boardId:id,boardTitle:req.body.title})
    }
})

app.get('/notes/*', function(req,res){
    boardId = req.originalUrl.substring(7,req.originalUrl.length-1)
    res.send(JSON.stringify(notes[boardId]))
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

