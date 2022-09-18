const Task=require("../models/Task");
const asyncWrapper=require('../middleware/async');
const {createCustomError}=require('../errors/custom-error');

const getAllTasks=asyncWrapper(async(req,res)=>{
        const tasks=await Task.find({});
        res.status(200).json({tasks});   
})

const createTask= asyncWrapper(async(req,res)=>{
        const task= await Task.create(req.body);
        res.status(201).json({task});
})

const getTask=asyncWrapper(async (req,res,next)=>{
        const {id:taskID}=req.params;   
        const task=await Task.findOne({_id:taskID});
        // will show up if id same length but not a valid id
        if(!task){
                return next(createCustomError(`no task with id ${taskID}`,404));
                // return res.status(404).json({msg:`no task with id ${taskID}`});  before refactoring 
        }
        res.status(200).json({task});
})

const updateTask=asyncWrapper(async(req,res,next)=>{
        const{id:taskID}=req.params;
        const task=await Task.findByIdAndUpdate({_id:taskID},req.body,{
            new:true, // to return the updated version not the old one
            runValidators:true,
        });
        if(!task){return next(createCustomError(`no task with id ${taskID}`,404));}
        res.status(200).json({task})
})

const deleteTask=asyncWrapper(async (req,res,next)=>{
        const{id:taskID}=req.params;
        const task=await Task.findByIdAndDelete({_id:taskID});
        if(!task){return next(createCustomError(`no task with id ${taskID}`,404));}
        res.status(200).send()
})

module.exports={
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
}