const Todo = require('../models/Todo');
const fetch = require('node-fetch');

module.exports = {
    getTodos: async (req,res)=>{
        console.log(req.user)
        try{
            const todoItems = await Todo.find({userId:req.user.id})
            const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            const response = await fetch('https://zenquotes.io/api/quotes/')
            const quoteRes = await response.json()
            const quote = quoteRes[0]["q"]
            console.log(quote)
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, quote: quote, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req, res)=>{
        try{
            await Todo.create({todo: req.body.todoItem, completed: false, userId: req.user.id})
            console.log('Todo has been added!')
            res.redirect('/todos')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}

// const fetch = require('node-fetch');

// (async () => {
//   try {

//     const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
//     const json = await response.json()

//     console.log(json.url);
//     console.log(json.explanation);
//   } catch (error) {
//     console.log(error.response.body);
//   }
// })();
