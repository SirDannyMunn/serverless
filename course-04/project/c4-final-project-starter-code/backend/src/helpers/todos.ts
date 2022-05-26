//@ts-nocheck
// @danny TODO - remove
import { TodosAccess } from './todosAcess'
import FileStore from './attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic

let bucketName = process.env.ATTACHMENT_S3_BUCKET

async function getTodosForUser(userId: string) {

    const todos = (new TodosAccess).getTodos(userId)
    return todos
}

async function createTodo(request: CreateTodoRequest, userId) {

    const itemId = uuid.v4()
    const now = new Date().toISOString()

    const newItem = {
        userId: userId,
        todoId: itemId,
        createdAt: now,
        name: request.name,
        dueDate: request.dueDate,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`,
        done: false,
    }

    const todo = await (new TodosAccess).createTodo(newItem)

    if (request.attachmentUrl) {
        newItem["attachmentUrl"] = (new FileStore).getPresignedUrl(itemId)
    }

    return newItem
}

async function updateTodo(request: UpdateTodoRequest, userId) {

    await (new TodosAccess).updateTodo(request, request.todoId, userId)

    return ""
}

async function deleteTodo(todoId, userId) {

    await (new TodosAccess).deleteTodo(todoId, userId)

    return ""
}

async function createAttachmentPresignedUrl(todoId, userId) {

    const todo = await (new TodosAccess).getTodo(request.todoId)
    if (todo.userId !== userId) {
        throw new Error("User not authorized")
    }

    const uploadUrl = (new FileStore).getPresignedUrl(request.todoId)

    return {
        "uploadUrl": uploadUrl
    };
}


export {
    getTodosForUser,
    createTodo,
    deleteTodo,
    updateTodo,
    createAttachmentPresignedUrl
}
