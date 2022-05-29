import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // DONE: Update a TODO item with the provided id using values in the "updatedTodo" object

    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const response = await updateTodo(updatedTodo, todoId, userId)

    return {
        statusCode: 200,
        body: JSON.stringify({
            item: response
        })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
