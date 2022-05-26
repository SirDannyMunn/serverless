import 'source-map-support/register'
// import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

import * as AWS from 'aws-sdk';
// import {Todo} from "../../../client/src/types/Todo";
// import * as AWSXRay from 'aws-xray-sdk'

// const XAWS = AWSXRay.captureAWS(AWS)
const XAWS = AWS

const docClient = new XAWS.DynamoDB.DocumentClient()

// const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {

    constructor(
        private readonly todosTable = process.env.TODOS_TABLE,
        // private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    ) {
    }

    async getTodo(todoId: string): Promise<TodoItem> {
        const result = await docClient.get({
            TableName: this.todosTable,
            Key: {
                todoId: todoId
            },
        }).promise()

        return result.Item as TodoItem
    }

    async getTodos(userId: string): Promise<TodoItem[]> {

        const params = {
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }

        const result = await docClient.query(params).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {

        const params = {
            TableName: this.todosTable,
            Item: todo
        }

        await docClient.put(params).promise()

        return todo as TodoItem
    }

    async updateTodo(updatedTodo, todoId: string, userId: string): Promise<String> {
        const params = {
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: "set #name = :n, dueDate = :due, done = :d",
            ExpressionAttributeValues: {
                ":n": updatedTodo.name,
                ":due": updatedTodo.dueDate,
                ":d": updatedTodo.done
            },
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ReturnValues: "UPDATED_NEW"
        }

        await docClient.update(params).promise()

        return todoId
    }

    async deleteTodo(todoId: string, userId: string) {
        const params = {
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            }
        }

        return await docClient.delete(params).promise()
    }
}

