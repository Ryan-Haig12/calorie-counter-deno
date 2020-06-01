import { Router } from 'https://deno.land/x/oak/mod.ts'
import * as userController from './controllers/user.ts'

const router = new Router()

router
    .get('/api/v1/users/id/:id', userController.getUserById)
    .get('/api/v1/users/username/:username', userController.getUserByName)
    .get('/api/v1/users/allData/:id', userController.getAllUserDataById)
    .post('/api/v1/users/create', userController.createUser)
    .put('/api/v1/users/update/:id', userController.updateUser)
    .delete('/api/v1/users/delete/:id', userController.deleteUser)

export default router