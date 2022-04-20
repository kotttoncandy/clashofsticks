const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const sockets = require("socket.io");
const io = sockets(server,  {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
  }
});
var path = require('path');
const { MongoClient } = require('mongodb');
const mongoose = require("mongoose")
const Trophy = require("./schemas/trophies.js");
const fs = require("fs")
const Card = require("./schemas/cards.js")
const cors = require("cors")
// Database Name
const dbName = 'myProject';
app.use(cors())
async function main() {
    fs.writeFileSync("matches.txt", "")
    const url = "mongodb+srv://forze:lolking0912@clashofsticks.eebij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

app.get('/', (req, res) => {
  res.send('<h1>i got a server up</h1>');
});


    try {

        mongoose.connect(url)
        console.log("connected succsesfully")
    } catch (e) {
        console.log(e)
    }

    io.on('connection', (socket) => {
        var codes = [

        ]
        function getLastValue(set) {
            let value;
            for (value of set);
            return value;
        }
        console.log(socket.id)
        codes.push(socket.id)
        socket.on('action', (e) => {
            socket.to(getLastValue(socket.rooms)).emit('message', e);

        });
        socket.on("login", async (e) => {
            let trophyProfile = await Trophy.findOne({ user: e.user + e.pass })
            let cardProfile = await Card.findOne({ user: e.user + e.pass })

            if (!trophyProfile) {
                trophyProfile = await new Trophy({
                    _id: mongoose.Types.ObjectId(),
                    user: e.user + e.pass,
                    password: e.pass,
                })
                await trophyProfile.save().catch(e => console.log(e))
            }
            if (!cardProfile) {
                cardProfile = await new Card({
                    _id: mongoose.Types.ObjectId(),
                    user: e.user + e.pass,
                    password: e.pass,
                })
                await cardProfile.save().catch(e => console.log(e))
            }
        })

        socket.on("gimme_arena", async (e) => {
            let trophyProfile = await Trophy.findOne({ user: e.user + e.pass })

            socket.emit("arena", trophyProfile)
        })

        socket.on('bomb', (a) => {
            socket.to(getLastValue(socket.rooms)).emit('idek', a);

            console.log(a)
        })

        var code = Math.floor(Math.random() * 9000)

        var matches = []
        function update_matches(e) {
            matches.push(e)
        }
        function remove_matches() {
            matches.splice(matches[0])
        }

        socket.on("join", async (a) => {
            let cardProfile = await Card.findOne({ user: a.user + a.pass })

            if (fs.readFileSync("matches.txt", 'utf8') === "") {
                socket.join(code)
                fs.writeFile('matches.txt', String(code), err => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    //file written successfully
                })
                console.log("I CREATED A MATCH!")

                console.log("code: " + getLastValue(socket.rooms))
                console.log(matches)

                console.log(cardProfile.cards)

            } else {
                var thing = fs.readFileSync("matches.txt", 'utf8')
                socket.join(parseInt(thing))
                console.log(parseInt(thing))
                console.log(socket.id + " has joined " + getLastValue(socket.rooms))
                console.log(io.sockets.adapter.rooms.get(getLastValue(socket.rooms)).size)
                console.log("code: " + getLastValue(socket.rooms))
                remove_matches()
                socket.to(getLastValue(socket.rooms)).emit("ready")
                socket.to(socket.id).emit("ready")
                console.log(cardProfile.cards)
                fs.writeFile('matches.txt', String(""), err => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    //file written successfully
                })
            }

        })

        socket.on("amiready", () => {
            if(io.sockets.adapter.rooms.get(getLastValue(socket.rooms)).size === 2) {
                io.to(socket.id).emit("ready")
            }
        })

        socket.on("getmedata", async (e) => {
            let cardProfile = await Card.findOne({ user: e.user + e.pass })
            console.log(socket.rooms)
            io.in(socket.id).emit('carddata', cardProfile.cards);
        })

        socket.on("dying", (e) => {
            console.log(e)
        })
        socket.on("test1", (e) => {
            console.log(e)
        })
        socket.on("lose", async (e) => {
            let trophyProfile = await Trophy.findOne({ user: e.user + e.pass })
            var code = getLastValue(socket.rooms)
            io.in(socket.id).socketsLeave(getLastValue(socket.rooms));
            console.log("you lost " + socket.id)
            console.log(trophyProfile.trophies)

            await Trophy.findOneAndUpdate({ _id: trophyProfile._id }, { trophies: trophyProfile.trophies -= 10 })
            console.log("trophy= " + trophyProfile.trophies)
            socket.emit("gohome")
            io.in(code).emit("winner", trophyProfile.trophies)
            socket.emit("arena", trophyProfile)

            return
        })

        socket.on("update_troph", async (e) => {

            let cardProfile = await Card.findOne({ user: e.user + e.pass })
            let trophyProfile = await Trophy.findOne({ user: e.user + e.pass })
            function find_arena(e) {
                if (e <= 100) {
                    var a = String("a1")
                    return a
                }
                if (e <= 200) {
                    var a = String("a2")
                    return a
                }
                if (e <= 300) {
                    var a = String("a3")
                    return a
                }
                if (e <= 400) {
                    var a = String("a4")
                    return a
                }
            }

            var arena = null
            var string_arena = find_arena(trophyProfile.trophies)
            if (string_arena === "a1") {
                arena = e.cards.a1
            }
            if (string_arena === "a2") {
                arena = e.cards.a2
            }
            if (string_arena === "a3") {
                arena = e.cards.a3
            }
            if (string_arena === "a4") {
                arena = e.cards.a4
            }
            var current_cards = cardProfile.cards
            var card = arena[Math.floor(Math.random() *arena.length)]
            if(current_cards.includes(card.tag)) {
                await Trophy.findOneAndUpdate({ _id: trophyProfile._id }, { trophies: trophyProfile.trophies += 10 })
                await Card.findOneAndUpdate({ _id: cardProfile._id }, { cards: current_cards })
                console.log(trophyProfile.trophies)
                socket.emit("go_home")
                socket.emit("arena", trophyProfile)
                io.in(socket.id).socketsLeave(getLastValue(socket.rooms));
                console.log(socket.rooms)
            } else {
                current_cards.push(card.tag)
            }
            await Trophy.findOneAndUpdate({ _id: trophyProfile._id }, { trophies: trophyProfile.trophies += 10 })
            await Card.findOneAndUpdate({ _id: cardProfile._id }, { cards: current_cards })
            console.log(trophyProfile.trophies)
            socket.emit("go_home")
            socket.emit("arena", trophyProfile)
            io.in(socket.id).socketsLeave(getLastValue(socket.rooms));
            console.log(socket.rooms)
        })

    });

    function action(socketId, thing) {
        return (data) => {
            io.emit("message", "1")
        }
    }

    server.listen(3000, () => {
        console.log('listening on *:3000');
    });
}

main()