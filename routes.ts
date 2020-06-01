import { Router } from 'https://deno.land/x/oak/mod.ts'
import * as authController from './controllers/auth.ts'
import * as calorieController from './controllers/calorielog.ts'
import * as exerciseController from './controllers/exerciselog.ts'
import * as userController from './controllers/user.ts'

const router = new Router()

router
    .post('/api/v1/auth', authController.login)

    .post('/api/v1/calorie/createLog', calorieController.createCalorieLog)
    .get('/api/v1/calorie/:userId', calorieController.getCalorieLog)
    .put('/api/v1/calorie/update/:logId', calorieController.updateCalorieLog)
    .delete('/api/v1/calorie/delete/:logId', calorieController.deleteCalorieLog)

    .post('/api/v1/exercise/createLog', exerciseController.createExerciseLog)
    .get('/api/v1/exercise/:userId', exerciseController.getExerciseLog)
    .put('/api/v1/exercise/update/:logId', exerciseController.updateExerciseLog)
    .delete('/api/v1/exercise/delete/:logId', exerciseController.deleteExerciseLog)

    .get('/api/v1/users/id/:id', userController.getUserById)
    .get('/api/v1/users/username/:username', userController.getUserByName)
    .get('/api/v1/users/allData/:id', userController.getAllUserDataById)
    .post('/api/v1/users/create', userController.createUser)
    .put('/api/v1/users/update/:id', userController.updateUser)
    .delete('/api/v1/users/delete/:id', userController.deleteUser)

export default router